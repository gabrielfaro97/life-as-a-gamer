export interface Game {
  id: string;
  name: string;
  coverUrl: string;
  finishedAt: string;
  platform: string;
  rating: number;
  steamGridDbId?: number;
}

export type SteamGridDbMatchStatus = 'unmatched' | 'auto-matched' | 'manual-review' | 'confirmed';
