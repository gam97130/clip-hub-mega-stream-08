
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Video, Series } from '../types/video';
import { importVideo, importSeries, seriesTitleExists, videoUrlExists } from '../utils/videoStorage';

interface ImportDataDialogProps {
  onImportComplete: () => void;
}

const ImportDataDialog: React.FC<ImportDataDialogProps> = ({ onImportComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('Aucun fichier sélectionné');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the data
        if (!data) {
          throw new Error('Fichier invalide');
        }

        // Résultats d'importation
        let videoImported = false;
        let seriesImported = false;

        // Handle series data first (so videos can be linked)
        if (data.series) {
          const { id, ...seriesData } = data.series;
          
          // Vérifier si la série existe déjà
          const existingSeries = seriesTitleExists(seriesData.title);
          
          if (existingSeries) {
            toast.info(`La série "${seriesData.title}" existe déjà`);
          } else {
            // Importer la série
            const newSeries = importSeries(seriesData);
            if (newSeries) {
              seriesImported = true;
            }
          }
        }

        // Handle video data
        if (data.video) {
          const { id, addedAt, ...videoData } = data.video;
          
          // Vérifier si la vidéo existe déjà
          if (videoUrlExists(videoData.url)) {
            toast.info('Une vidéo avec cette URL existe déjà');
          } else {
            // Importer la vidéo
            const newVideo = importVideo(videoData);
            if (newVideo) {
              videoImported = true;
            }
          }
        }

        // Afficher le résultat
        if (videoImported || seriesImported) {
          toast.success('Importation réussie');
          setOpen(false);
          onImportComplete();
        } else {
          toast.info('Aucun nouvel élément à importer');
        }

      } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        toast.error('Impossible d\'importer les données');
      } finally {
        setIsUploading(false);
        // Reset the input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-clip-gray text-gray-300 hover:text-white hover:bg-clip-gray">
          <Upload className="mr-2 h-4 w-4" />
          Importer des données
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-clip-gray border-clip-lightGray text-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Importer des données</DialogTitle>
          <DialogDescription className="text-gray-400">
            Sélectionnez un fichier JSON exporté depuis ClipHub MegaStream pour importer des vidéos ou des séries.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border-2 border-dashed border-clip-lightGray rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-300 mb-1">
                {isUploading ? 'Importation en cours...' : 'Cliquez pour sélectionner un fichier'}
              </p>
              <p className="text-xs text-gray-400">
                Formats acceptés: JSON
              </p>
            </label>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-transparent text-white hover:bg-clip-lightGray/10">
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataDialog;
