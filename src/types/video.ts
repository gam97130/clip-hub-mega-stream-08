
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  category: string;
  addedAt: number;
  seriesId?: string;
  episodeNumber?: number;
}

export type VideoCategory = 'Tous' | 'Films' | 'Séries' | 'Musique' | 'Autres';

export interface Series {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}
