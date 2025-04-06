
import { Video, VideoCategory } from '../types/video';

const STORAGE_KEY = 'clipHub_videos';

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
    addedAt: Date.now() - 86400000
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
