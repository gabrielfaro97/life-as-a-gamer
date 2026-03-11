import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  searchGames,
  getGridsForGame,
  type SteamGridDbGame,
} from '../services/steamGridDb';

type GameAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectGame?: (game: SteamGridDbGame, coverUrl?: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
};

function GameAutocomplete({
  value,
  onChange,
  onSelectGame,
  placeholder,
  required,
  id,
  name,
}: GameAutocompleteProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<SteamGridDbGame[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSearchRef = useRef(false);

  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchGames(term);
      setSuggestions(results.slice(0, 8));
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSelectSuggestion(game: SteamGridDbGame) {
    skipNextSearchRef.current = true;
    onChange(game.name);
    setIsOpen(false);
    setSuggestions([]);

    if (onSelectGame) {
      try {
        const grids = await getGridsForGame(game.id);
        const coverUrl = grids.length > 0 ? grids[0].url : undefined;
        onSelectGame(game, coverUrl);
      } catch {
        onSelectGame(game);
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          event.preventDefault();
          handleSelectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          role="listbox"
        >
          {suggestions.map((game, index) => (
            <li
              key={game.id}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                index === activeIndex
                  ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100'
                  : 'text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-700/50'
              }`}
              onClick={() => handleSelectSuggestion(game)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{game.name}</span>
                {game.verified && (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t('autocomplete.verified')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GameAutocomplete;
