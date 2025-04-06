
import React, { useState, useEffect } from 'react';
import { getVideos, addVideo } from '../utils/videoStorage';
import { Video } from '../types/video';
import VideoList from '../components/VideoList';
import VideoPlayer from '../components/VideoPlayer';
import AddVideoForm from '../components/AddVideoForm';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  useEffect(() => {
    // Charger les vidéos depuis le localStorage
    const loadedVideos = getVideos();
    setVideos(loadedVideos);
  }, []);
  
  const handleAddVideo = (newVideo: Omit<Video, 'id' | 'addedAt'>) => {
    const video = addVideo(newVideo);
    setVideos([...videos, video]);
  };
  
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-clip-dark">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              ClipHub <span className="text-clip-purple">MegaStream</span>
            </h1>
            {!selectedVideo && <AddVideoForm onAddVideo={handleAddVideo} />}
          </div>
          
          {!selectedVideo && (
            <p className="text-gray-400 text-sm md:text-base">
              Votre bibliothèque de vidéos personnelle - Stockez et regardez vos vidéos préférées
            </p>
          )}
        </header>
        
        <main>
          {selectedVideo ? (
            <VideoPlayer video={selectedVideo} onBack={handleBack} />
          ) : (
            <VideoList videos={videos} onSelectVideo={handleSelectVideo} />
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
