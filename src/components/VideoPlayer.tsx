
import React, { useState } from 'react';
import { Video } from '../types/video';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, Share2, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getSeriesById } from '../utils/videoStorage';

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onBack }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // Generate a shareable URL - for this example, we'll use the current URL
      const shareUrl = window.location.href;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: shareUrl,
        });
        toast.success('Contenu partagé');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Lien copié dans le presse-papier');
      }
    } catch (error) {
      console.error('Erreur de partage:', error);
      toast.error('Impossible de partager cette vidéo');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Récupérer les données de la série si cette vidéo fait partie d'une série
      let seriesData = null;
      if (video.seriesId) {
        seriesData = getSeriesById(video.seriesId);
      }
      
      // Créer un objet avec toutes les données pertinentes
      const downloadData = {
        video: {
          ...video,
          addedAt: new Date(video.addedAt).toISOString() // Convertir timestamp en format lisible
        },
        series: seriesData
      };
      
      // Convertir en JSON
      const jsonData = JSON.stringify(downloadData, null, 2);
      
      // Créer un blob avec les données
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.title.replace(/\s+/g, '_')}_data.json`;
      
      // Déclencher le téléchargement
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Données téléchargées avec succès');
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error('Impossible de télécharger les données');
    } finally {
      setIsDownloading(false);
    }
  };

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
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-clip-purple/20 text-clip-lightPurple">
                {video.category}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-clip-lightGray/20"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Télécharger les données</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
          
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-clip-lightGray/20"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger les données
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoPlayer;
