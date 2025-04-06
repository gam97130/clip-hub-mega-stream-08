
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Series } from '../types/video';
import { getSeriesVideos } from '../utils/videoStorage';

interface SeriesListProps {
  series: Series[];
  onSelectSeries: (series: Series) => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ series, onSelectSeries }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4">Séries</h2>
      
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
                className="overflow-hidden hover-scale cursor-pointer bg-clip-gray border-clip-lightGray animate-fade-in"
                onClick={() => onSelectSeries(seriesItem)}
              >
                <div className="aspect-video overflow-hidden bg-clip-dark">
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
                  <h3 className="font-semibold text-lg mb-1 truncate text-white">{seriesItem.title}</h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{seriesItem.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
                      {videos.length} épisode{videos.length !== 1 ? 's' : ''}
                    </span>
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
