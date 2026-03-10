const API_BASE = '/api/steamgriddb';

export interface SteamGridDbGame {
  id: number;
  name: string;
  types: string[];
  verified: boolean;
}

export interface SteamGridDbGrid {
  id: number;
  score: number;
  style: string;
  width: number;
  height: number;
  nsfw: boolean;
  humor: boolean;
  notes: string | null;
  mime: string;
  language: string;
  url: string;
  thumb: string;
  lock: boolean;
  epilepsy: boolean;
  upvotes: number;
  downvotes: number;
  author: {
    name: string;
    steam64: string;
    avatar: string;
  };
}

export interface SearchResult {
  success: boolean;
  data: SteamGridDbGame[];
}

export interface GridsResult {
  success: boolean;
  data: SteamGridDbGrid[];
}

export async function searchGames(term: string): Promise<SteamGridDbGame[]> {
  const encodedTerm = encodeURIComponent(term);
  
  const response = await fetch(`${API_BASE}/search/autocomplete/${encodedTerm}`);

  if (!response.ok) {
    throw new Error(`SteamGridDB search failed: ${response.status}`);
  }

  const result: SearchResult = await response.json();
  return result.data || [];
}

export async function getGridsForGame(gameId: number): Promise<SteamGridDbGrid[]> {
  const response = await fetch(`${API_BASE}/grids/game/${gameId}?dimensions=600x900`);

  if (!response.ok) {
    throw new Error(`SteamGridDB grids failed: ${response.status}`);
  }

  const result: GridsResult = await response.json();
  return result.data || [];
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isExactMatch(searchTerm: string, resultName: string): boolean {
  return normalizeTitle(searchTerm) === normalizeTitle(resultName);
}

export function isCloseMatch(searchTerm: string, resultName: string): boolean {
  const normalized1 = normalizeTitle(searchTerm);
  const normalized2 = normalizeTitle(resultName);
  
  if (normalized1 === normalized2) return true;
  if (normalized2.startsWith(normalized1)) return true;
  if (normalized1.startsWith(normalized2)) return true;
  
  return false;
}
