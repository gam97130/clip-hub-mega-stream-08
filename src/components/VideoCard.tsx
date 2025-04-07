
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from '../types/video';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getSeriesById } from '../utils/videoStorage';
import { Button } from '@/components/ui/button';
import { Trash2, Film } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, onDelete }) => {
  const formattedDate = formatDistanceToNow(new Date(video.addedAt), { 
    addSuffix: true,
    locale: fr
  });

  // Si la vidéo fait partie d'une série, récupérer les informations de la série
  const series = video.seriesId ? getSeriesById(video.seriesId) : undefined;

  // Détermine si c'est un lien Mega
  const isMegaLink = video.url.includes('mega.nz');

  return (
    <Card 
      className="overflow-hidden hover-scale cursor-pointer bg-clip-gray border-clip-lightGray animate-fade-in"
    >
      <div 
        className="aspect-video overflow-hidden bg-clip-dark relative"
        onClick={() => onClick(video)}
      >
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
        
        {/* Badge pour vidéo Mega */}
        {isMegaLink && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            MEGA
          </div>
        )}
        
        {/* Badge pour épisode */}
        {video.episodeNumber && (
          <div className="absolute bottom-2 left-2 bg-clip-purple text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Film className="h-3 w-3 mr-1" />
            Ep. {video.episodeNumber}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1" onClick={() => onClick(video)}>
            <h3 className="font-semibold text-lg mb-1 truncate text-white">
              {video.title}
            </h3>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-auto ml-2 mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-clip-dark border-clip-lightGray">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Supprimer la vidéo</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Êtes-vous sûr de vouloir supprimer "{video.title}" ? Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-clip-gray text-white hover:bg-clip-lightGray">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onDelete(video.id)}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="flex justify-between items-center" onClick={() => onClick(video)}>
          <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
            {video.category}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        {series && (
          <div className="mt-2 pt-2 border-t border-clip-lightGray/30" onClick={() => onClick(video)}>
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
