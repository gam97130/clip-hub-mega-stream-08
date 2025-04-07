
import React, { useState } from 'react';
import VideoCard from './VideoCard';
import { Video, VideoCategory } from '../types/video';
import { filterVideosByCategory, getCategories, searchVideos } from '../utils/videoStorage';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import { toast } from 'sonner';

interface VideoListProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onDeleteVideo: (id: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelectVideo, onDeleteVideo }) => {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const categories = getCategories();
  
  const filteredByCategory = filterVideosByCategory(videos, activeCategory);
  const filteredVideos = searchVideos(filteredByCategory, searchTerm);

  // Organise les vidéos pour montrer les épisodes ensemble
  const organizeVideos = (videos: Video[]) => {
    // Trie les vidéos par série et numéro d'épisode
    return [...videos].sort((a, b) => {
      // D'abord groupe par série
      if (a.seriesId && b.seriesId) {
        if (a.seriesId !== b.seriesId) {
          return a.seriesId.localeCompare(b.seriesId);
        }
        // Ensuite par numéro d'épisode
        return (a.episodeNumber || 0) - (b.episodeNumber || 0);
      }
      
      // Les vidéos sans série à la fin
      if (a.seriesId && !b.seriesId) return -1;
      if (!a.seriesId && b.seriesId) return 1;
      
      // Par défaut, trier par date d'ajout (du plus récent au plus ancien)
      return b.addedAt - a.addedAt;
    });
  };

  const handleDeleteVideo = (id: string) => {
    onDeleteVideo(id);
    toast.success('Vidéo supprimée avec succès');
  };

  // Organise les vidéos filtrées
  const organizedVideos = organizeVideos(filteredVideos);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="mb-4">
        <SearchBar onSearch={setSearchTerm} />
      </div>
      
      <div className="flex overflow-x-auto pb-2 no-scrollbar">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`${
                activeCategory === category 
                  ? "bg-clip-purple text-white" 
                  : "bg-clip-gray text-gray-300 hover:text-white hover:bg-clip-gray"
              } rounded-full px-4 whitespace-nowrap`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {organizedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-clip-gray rounded-lg border border-clip-lightGray">
          <p className="text-gray-400 mb-4">Aucune vidéo trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizedVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onClick={onSelectVideo}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
