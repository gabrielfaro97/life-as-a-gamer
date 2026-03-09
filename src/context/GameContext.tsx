import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Game } from '../types/Game';

const SAMPLE_GAME: Game = {
  id: '1',
  name: 'The Legend of Zelda: Tears of the Kingdom',
  coverUrl:
    'https://cdn2.steamgriddb.com/grid/ae758fbcbd5bd841516c53b3c08ebc6f.png',
  finishedAt: '2026-03-01T00:00:00.000Z',
  platform: 'Nintendo Switch',
  rating: 10,
};

type GameContextValue = {
  games: Game[];
  addGame: (game: Game) => void;
  removeGame: (game: Game) => void;
  updateGame: (game: Game) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: ReactNode;
};

function GameProvider({ children }: GameProviderProps) {
  const [games, setGames] = useState<Game[]>([SAMPLE_GAME]);

  const addGame = useCallback((game: Game) => {
    setGames((current) => [game, ...current]);
  }, []);

  const removeGame = useCallback((game: Game) => {
    setGames((current) => current.filter((g) => g.id !== game.id));
  }, []);

  const updateGame = useCallback((game: Game) => {
    setGames((current) =>
      current.map((g) => (g.id === game.id ? game : g)),
    );
  }, []);

  const value = useMemo(
    () => ({ games, addGame, removeGame, updateGame }),
    [games, addGame, removeGame, updateGame],
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

function useGames(): GameContextValue {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGames deve ser usado dentro de GameProvider');
  }

  return context;
}

export { GameProvider, useGames };
