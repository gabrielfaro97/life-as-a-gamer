import type { Game } from '../types/Game';

const STORAGE_KEY = 'life-as-a-gamer:games';

function isGame(value: unknown): value is Game {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.coverUrl === 'string' &&
    typeof obj.finishedAt === 'string' &&
    typeof obj.platform === 'string' &&
    typeof obj.rating === 'number'
  );
}

export function loadGames(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isGame);
  } catch {
    return [];
  }
}

export function saveGames(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    // Ignore quota exceeded or other storage errors
  }
}
