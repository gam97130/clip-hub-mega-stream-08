
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  category: string;
  addedAt: number;
}

export type VideoCategory = 'Tous' | 'Films' | 'Séries' | 'Musique' | 'Autres';
