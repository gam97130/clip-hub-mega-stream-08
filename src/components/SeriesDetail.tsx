
import React from 'react';
import { Series, Video } from '../types/video';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SeriesDetailProps {
  series: Series;
  videos: Video[];
  onBack: () => void;
  onSelectVideo: (video: Video) => void;
  onDeleteVideo: (id: string) => void;
}

const SeriesDetail: React.FC<SeriesDetailProps> = ({ series, videos, onBack, onSelectVideo, onDeleteVideo }) => {
  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 text-gray-400 hover:text-white" 
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Card className="bg-clip-gray border-clip-lightGray overflow-hidden mb-8">
        <div className="aspect-video overflow-hidden bg-clip-dark">
          {series.thumbnail ? (
            <img 
              src={series.thumbnail} 
              alt={series.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-clip-darkPurple">
              <span className="text-clip-lightPurple">Pas d'aperçu</span>
            </div>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-white">{series.title}</CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            {videos.length} épisode{videos.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        
        {series.description && (
          <CardContent>
            <p className="text-gray-300">{series.description}</p>
          </CardContent>
        )}
      </Card>
      
      <h3 className="text-lg font-bold text-white mb-4">Épisodes</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <Card 
            key={video.id} 
            className="overflow-hidden bg-clip-gray border-clip-lightGray animate-fade-in flex"
          >
            <div 
              className="w-1/4 aspect-video overflow-hidden bg-clip-dark cursor-pointer"
              onClick={() => onSelectVideo(video)}
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
            </div>
            <CardContent className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <div onClick={() => onSelectVideo(video)}>
                  <h4 className="font-semibold text-md text-white">
                    {video.episodeNumber ? `Épisode ${video.episodeNumber}: ` : ''}{video.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{video.description}</p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-auto ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-clip-dark border-clip-lightGray">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Supprimer l'épisode</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Êtes-vous sûr de vouloir supprimer l'épisode "{video.title}" ? Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-clip-gray text-white hover:bg-clip-lightGray">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => onDeleteVideo(video.id)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Button 
                onClick={() => onSelectVideo(video)}
                className="self-start mt-2 bg-clip-purple text-white hover:bg-clip-purple/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Regarder
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeriesDetail;
