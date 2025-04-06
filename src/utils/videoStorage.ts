
import { Video, VideoCategory, Series } from '../types/video';

const STORAGE_KEY = 'clipHub_videos';
const SERIES_STORAGE_KEY = 'clipHub_series';

// Sample videos
const defaultVideos: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'Un court métrage d\'animation 3D populaire',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    category: 'Films',
    addedAt: Date.now() - 86400000 * 2
  },
  {
    id: '2',
    title: 'Elephant Dream',
    description: 'Premier film libre de Blender Foundation',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    category: 'Films',
    addedAt: Date.now() - 86400000,
    seriesId: 'sample-series',
    episodeNumber: 1
  },
  {
    id: '3',
    title: 'Elephant Dream - Partie 2',
    description: 'Suite du premier film libre de Blender Foundation',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    category: 'Films',
    addedAt: Date.now() - 86400000 / 2,
    seriesId: 'sample-series',
    episodeNumber: 2
  }
];

// Exemple de séries
const defaultSeries: Series[] = [
  {
    id: 'sample-series',
    title: 'Elephant Dream - Série',
    description: 'Série de films de Blender Foundation',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg'
  }
];

/**
 * Récupère toutes les vidéos stockées
 */
export const getVideos = (): Video[] => {
  const storedVideos = localStorage.getItem(STORAGE_KEY);
  
  if (!storedVideos) {
    // Initialiser avec des vidéos par défaut lors de la première utilisation
    saveVideos(defaultVideos);
    saveSeries(defaultSeries);
    return defaultVideos;
  }
  
  return JSON.parse(storedVideos);
};

/**
 * Ajoute une nouvelle vidéo
 */
export const addVideo = (video: Omit<Video, 'id' | 'addedAt'>): Video => {
  const videos = getVideos();
  const newVideo: Video = {
    ...video,
    id: Date.now().toString(),
    addedAt: Date.now()
  };
  
  saveVideos([...videos, newVideo]);
  return newVideo;
};

/**
 * Récupère une vidéo par son ID
 */
export const getVideoById = (id: string): Video | undefined => {
  const videos = getVideos();
  return videos.find(video => video.id === id);
};

/**
 * Supprime une vidéo par son ID
 */
export const deleteVideo = (id: string): boolean => {
  const videos = getVideos();
  const newVideos = videos.filter(video => video.id !== id);
  
  if (newVideos.length === videos.length) {
    return false; // Vidéo non trouvée
  }
  
  saveVideos(newVideos);
  return true;
};

/**
 * Sauvegarde toutes les vidéos
 */
const saveVideos = (videos: Video[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

/**
 * Obtient les catégories disponibles
 */
export const getCategories = (): VideoCategory[] => {
  return ['Tous', 'Films', 'Séries', 'Musique', 'Autres'];
};

/**
 * Filtre les vidéos par catégorie
 */
export const filterVideosByCategory = (videos: Video[], category: VideoCategory): Video[] => {
  if (category === 'Tous') {
    return videos;
  }
  
  return videos.filter(video => video.category === category);
};

/**
 * Recherche des vidéos par terme de recherche
 */
export const searchVideos = (videos: Video[], searchTerm: string): Video[] => {
  if (!searchTerm.trim()) {
    return videos;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return videos.filter(
    video => 
      video.title.toLowerCase().includes(lowerSearchTerm) ||
      video.description.toLowerCase().includes(lowerSearchTerm) ||
      video.category.toLowerCase().includes(lowerSearchTerm)
  );
};

/**
 * Récupère toutes les séries
 */
export const getSeries = (): Series[] => {
  const storedSeries = localStorage.getItem(SERIES_STORAGE_KEY);
  
  if (!storedSeries) {
    // Initialiser avec des séries par défaut
    saveSeries(defaultSeries);
    return defaultSeries;
  }
  
  return JSON.parse(storedSeries);
};

/**
 * Sauvegarde toutes les séries
 */
const saveSeries = (series: Series[]): void => {
  localStorage.setItem(SERIES_STORAGE_KEY, JSON.stringify(series));
};

/**
 * Ajoute une nouvelle série
 */
export const addSeries = (series: Omit<Series, 'id'>): Series => {
  const existingSeries = getSeries();
  const newSeries: Series = {
    ...series,
    id: Date.now().toString()
  };
  
  saveSeries([...existingSeries, newSeries]);
  return newSeries;
};

/**
 * Supprime une série par son ID et met à jour les vidéos associées
 */
export const deleteSeries = (id: string): boolean => {
  // Vérifier si la série existe
  const series = getSeries();
  const newSeries = series.filter(s => s.id !== id);

  if (newSeries.length === series.length) {
    return false; // Série non trouvée
  }

  // Mettre à jour les vidéos qui appartiennent à cette série
  const videos = getVideos();
  const updatedVideos = videos.map(video => {
    if (video.seriesId === id) {
      // Retirer l'association à la série
      const { seriesId, episodeNumber, ...rest } = video;
      return rest;
    }
    return video;
  });

  // Sauvegarder les changements
  saveSeries(newSeries);
  saveVideos(updatedVideos);
  return true;
};

/**
 * Obtient les vidéos d'une série
 */
export const getSeriesVideos = (seriesId: string): Video[] => {
  const videos = getVideos();
  return videos
    .filter(video => video.seriesId === seriesId)
    .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
};

/**
 * Obtient la série par ID
 */
export const getSeriesById = (id: string): Series | undefined => {
  const series = getSeries();
  return series.find(s => s.id === id);
};
