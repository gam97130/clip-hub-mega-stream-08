
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from '../types/video';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getSeriesById } from '../utils/videoStorage';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const formattedDate = formatDistanceToNow(new Date(video.addedAt), { 
    addSuffix: true,
    locale: fr
  });

  // Si la vidéo fait partie d'une série, récupérer les informations de la série
  const series = video.seriesId ? getSeriesById(video.seriesId) : undefined;

  return (
    <Card 
      className="overflow-hidden hover-scale cursor-pointer bg-clip-gray border-clip-lightGray animate-fade-in"
      onClick={() => onClick(video)}
    >
      <div className="aspect-video overflow-hidden bg-clip-dark">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-clip-darkPurple">
            <span className="text-clip-lightPurple">Pas d'aperçu</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate text-white">
          {video.episodeNumber ? `E${video.episodeNumber}: ` : ''}{video.title}
        </h3>
        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
            {video.category}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        {series && (
          <div className="mt-2 pt-2 border-t border-clip-lightGray/30">
            <span className="text-xs text-clip-lightPurple">
              Série: {series.title}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;
