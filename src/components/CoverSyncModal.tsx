import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Game } from '../types/Game';
import {
  searchGames,
  getGridsForGame,
  isExactMatch,
  isCloseMatch,
  type SteamGridDbGame,
  type SteamGridDbGrid,
} from '../services/steamGridDb';

type CoverSyncModalProps = {
  game: Game;
  open: boolean;
  onClose: () => void;
  onSelectCover: (coverUrl: string, steamGridDbId: number) => void;
};

type Step = 'searching' | 'select-game' | 'select-cover' | 'error';

function CoverSyncModal({ game, open, onClose, onSelectCover }: CoverSyncModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('searching');
  const [games, setGames] = useState<SteamGridDbGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<SteamGridDbGame | null>(null);
  const [covers, setCovers] = useState<SteamGridDbGrid[]>([]);
  const [error, setError] = useState<string>('');
  const [loadingCovers, setLoadingCovers] = useState(false);

  const handleSelectGame = useCallback((sgdbGame: SteamGridDbGame) => {
    setSelectedGame(sgdbGame);
    setLoadingCovers(true);
    setStep('select-cover');

    getGridsForGame(sgdbGame.id)
      .then((grids) => {
        if (grids.length === 0) {
          setError(t('coverSync.noCovers'));
          setStep('error');
          return;
        }
        setCovers(grids);
      })
      .catch((err) => {
        setError(err.message || t('coverSync.coversError'));
        setStep('error');
      })
      .finally(() => {
        setLoadingCovers(false);
      });
  }, [t]);

  useEffect(() => {
    if (!open) return;

    setStep('searching');
    setGames([]);
    setSelectedGame(null);
    setCovers([]);
    setError('');

    searchGames(game.name)
      .then((results) => {
        if (results.length === 0) {
          setError(t('coverSync.noResults'));
          setStep('error');
          return;
        }

        const exactMatch = results.find((r) => isExactMatch(game.name, r.name));
        if (exactMatch) {
          handleSelectGame(exactMatch);
          return;
        }

        const closeMatch = results.find((r) => isCloseMatch(game.name, r.name));
        if (closeMatch && results.length === 1) {
          handleSelectGame(closeMatch);
          return;
        }

        setGames(results);
        setStep('select-game');
      })
      .catch((err) => {
        setError(err.message || t('coverSync.searchError'));
        setStep('error');
      });
  }, [open, game.name, t, handleSelectGame]);

  function handleSelectCover(cover: SteamGridDbGrid) {
    if (selectedGame) {
      onSelectCover(cover.url, selectedGame.id);
    }
  }

  function handleBackToGames() {
    setStep('select-game');
    setCovers([]);
    setSelectedGame(null);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t('coverSync.title')}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {game.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
            aria-label={t('coverSync.close')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'searching' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                {t('coverSync.searching')}
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-sm text-red-500">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                {t('coverSync.close')}
              </button>
            </div>
          )}

          {step === 'select-game' && (
            <div>
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {t('coverSync.selectGame')}
              </p>
              <div className="space-y-2">
                {games.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGame(g)}
                    className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
                  >
                    <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">
                      {g.name}
                    </span>
                    {g.verified && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {t('coverSync.verified')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'select-cover' && (
            <div>
              {selectedGame && games.length > 0 && (
                <button
                  type="button"
                  onClick={handleBackToGames}
                  className="mb-4 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('coverSync.backToGames')}
                </button>
              )}
              
              {loadingCovers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {t('coverSync.loadingCovers')}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {t('coverSync.selectCover')}
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {covers.map((cover) => (
                      <button
                        key={cover.id}
                        type="button"
                        onClick={() => handleSelectCover(cover)}
                        className="group relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-indigo-500"
                      >
                        <img
                          src={cover.thumb}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                            {t('coverSync.select')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoverSyncModal;
