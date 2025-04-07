
import React from 'react';
import { Video } from '../types/video';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onBack }) => {
  const formattedDate = formatDistanceToNow(new Date(video.addedAt), { 
    addSuffix: true,
    locale: fr
  });

  // Déterminer si c'est un lien Mega
  const isMegaLink = video.url.includes('mega.nz');

  // Créer l'URL d'intégration pour Mega si c'est un lien Mega
  const getEmbedUrl = () => {
    if (isMegaLink) {
      // Extraire l'ID de fichier du lien Mega
      const megaMatch = video.url.match(/\/file\/([^#]+)#([^$]+)/);
      if (megaMatch && megaMatch.length >= 3) {
        const fileId = megaMatch[1];
        const fileKey = megaMatch[2];
        return `https://mega.nz/embed/${fileId}#${fileKey}`;
      }
      // Sinon, utiliser le lien direct pour l'iframe
      return video.url.replace('/file/', '/embed/');
    }
    return null;
  };

  const embedUrl = isMegaLink ? getEmbedUrl() : null;

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
      
      <Card className="bg-clip-gray border-clip-lightGray overflow-hidden">
        <div className="aspect-video overflow-hidden bg-clip-dark">
          {isMegaLink ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay"
                title={video.title}
              ></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                <p className="text-white text-center">Le format du lien Mega n'est pas valide.</p>
                <Button
                  variant="outline" 
                  className="mt-4 bg-clip-gray text-gray-300 hover:text-white hover:bg-clip-gray"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  Ouvrir sur Mega
                </Button>
              </div>
            )
          ) : (
            <video 
              src={video.url} 
              controls 
              autoPlay 
              className="w-full h-full"
              poster={video.thumbnail}
            ></video>
          )}
        </div>
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl md:text-2xl text-white">{video.title}</CardTitle>
            <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
              {video.category}
            </span>
          </div>
          <CardDescription className="text-gray-400 text-sm">
            Ajouté {formattedDate}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-300">{video.description}</p>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-clip-lightGray pt-4">
          <Button
            variant="outline"
            className="bg-clip-gray text-gray-300 hover:text-white hover:bg-clip-gray"
            onClick={() => window.open(video.url, '_blank')}
          >
            Ouvrir dans un nouvel onglet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoPlayer;
