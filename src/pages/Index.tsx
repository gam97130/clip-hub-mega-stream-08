
import React, { useState, useEffect } from 'react';
import { getVideos, addVideo, getSeries, getSeriesVideos, getSeriesById } from '../utils/videoStorage';
import { Video, Series } from '../types/video';
import VideoList from '../components/VideoList';
import VideoPlayer from '../components/VideoPlayer';
import AddVideoForm from '../components/AddVideoForm';
import SeriesList from '../components/SeriesList';
import SeriesDetail from '../components/SeriesDetail';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [activeTab, setActiveTab] = useState<string>('videos');
  
  useEffect(() => {
    // Charger les vidéos et les séries depuis le localStorage
    const loadedVideos = getVideos();
    const loadedSeries = getSeries();
    setVideos(loadedVideos);
    setSeries(loadedSeries);
  }, []);
  
  const handleAddVideo = (newVideo: Omit<Video, 'id' | 'addedAt'>) => {
    const video = addVideo(newVideo);
    setVideos([...videos, video]);
  };
  
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setSelectedSeries(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSeries = (seriesItem: Series) => {
    setSelectedSeries(seriesItem);
    setSelectedVideo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setSelectedVideo(null);
    setSelectedSeries(null);
  };

  // Si une série est sélectionnée, obtenir ses vidéos
  const seriesVideos = selectedSeries ? getSeriesVideos(selectedSeries.id) : [];

  return (
    <div className="min-h-screen bg-clip-dark">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              ClipHub <span className="text-clip-purple">MegaStream</span>
            </h1>
            {!selectedVideo && !selectedSeries && <AddVideoForm onAddVideo={handleAddVideo} />}
          </div>
          
          {!selectedVideo && !selectedSeries && (
            <p className="text-gray-400 text-sm md:text-base">
              Votre bibliothèque de vidéos personnelle - Stockez et regardez vos vidéos préférées
            </p>
          )}
        </header>
        
        <main>
          {selectedVideo ? (
            <VideoPlayer video={selectedVideo} onBack={handleBack} />
          ) : selectedSeries ? (
            <SeriesDetail 
              series={selectedSeries} 
              videos={seriesVideos} 
              onBack={handleBack}
              onSelectVideo={handleSelectVideo}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-clip-gray w-full mb-6">
                <TabsTrigger 
                  value="videos" 
                  className="text-white data-[state=active]:bg-clip-purple data-[state=active]:text-white"
                >
                  Vidéos
                </TabsTrigger>
                <TabsTrigger 
                  value="series" 
                  className="text-white data-[state=active]:bg-clip-purple data-[state=active]:text-white"
                >
                  Séries
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos" className="mt-0">
                <VideoList videos={videos} onSelectVideo={handleSelectVideo} />
              </TabsContent>
              
              <TabsContent value="series" className="mt-0">
                <SeriesList series={series} onSelectSeries={handleSelectSeries} />
              </TabsContent>
            </Tabs>
          )}
        </main>
        
        <footer className="mt-12 py-6 border-t border-clip-lightGray/30 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} ClipHub MegaStream - Tous droits réservés
        </footer>
      </div>
    </div>
  );
};

export default Index;
