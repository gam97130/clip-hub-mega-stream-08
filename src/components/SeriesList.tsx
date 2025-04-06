
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Series } from '../types/video';
import { getSeriesVideos } from '../utils/videoStorage';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddSeriesForm from './AddSeriesForm';

interface SeriesListProps {
  series: Series[];
  onSelectSeries: (series: Series) => void;
  onAddSeries: (series: Omit<Series, 'id'>) => void;
  onDeleteSeries: (id: string) => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ series, onSelectSeries, onAddSeries, onDeleteSeries }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Séries</h2>
        <AddSeriesForm onAddSeries={onAddSeries} />
      </div>
      
      {series.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-clip-gray rounded-lg border border-clip-lightGray">
          <p className="text-gray-400 mb-4">Aucune série disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((seriesItem) => {
            const videos = getSeriesVideos(seriesItem.id);
            return (
              <Card 
                key={seriesItem.id} 
                className="overflow-hidden hover-scale bg-clip-gray border-clip-lightGray animate-fade-in"
              >
                <div 
                  className="aspect-video overflow-hidden bg-clip-dark cursor-pointer"
                  onClick={() => onSelectSeries(seriesItem)}
                >
                  {seriesItem.thumbnail ? (
                    <img 
                      src={seriesItem.thumbnail} 
                      alt={seriesItem.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-clip-darkPurple">
                      <span className="text-clip-lightPurple">Pas d'aperçu</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-1 truncate text-white cursor-pointer"
                    onClick={() => onSelectSeries(seriesItem)}
                  >
                    {seriesItem.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{seriesItem.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
                      {videos.length} épisode{videos.length !== 1 ? 's' : ''}
                    </span>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-1 h-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-clip-dark border-clip-lightGray">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Supprimer la série</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Êtes-vous sûr de vouloir supprimer la série "{seriesItem.title}" ? 
                            Cette action ne peut pas être annulée et supprimera également le lien entre les vidéos et cette série.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-clip-gray text-white hover:bg-clip-lightGray">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => onDeleteSeries(seriesItem.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeriesList;
