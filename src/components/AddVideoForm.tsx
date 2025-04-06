
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories } from '../utils/videoStorage';
import { toast } from '@/components/ui/use-toast';
import { VideoCategory } from '../types/video';

interface AddVideoFormProps {
  onAddVideo: (video: { 
    title: string; 
    description: string; 
    url: string; 
    thumbnail?: string; 
    category: string;
  }) => void;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ onAddVideo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Films');
  const [isOpen, setIsOpen] = useState(false);
  const categories = getCategories().filter(cat => cat !== 'Tous');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et l'URL sont obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    // Validation simple de l'URL
    if (!url.startsWith('http')) {
      toast({
        title: "URL invalide",
        description: "L'URL doit commencer par http:// ou https://",
        variant: "destructive"
      });
      return;
    }
    
    onAddVideo({
      title,
      description,
      url,
      thumbnail,
      category
    });
    
    // Réinitialiser le formulaire
    setTitle('');
    setDescription('');
    setUrl('');
    setThumbnail('');
    setCategory('Films');
    setIsOpen(false);
    
    toast({
      title: "Vidéo ajoutée",
      description: "Votre vidéo a été ajoutée avec succès",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-clip-purple hover:bg-clip-purple/90">
          Ajouter une vidéo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-clip-gray border-clip-lightGray text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle vidéo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la vidéo"
              className="bg-clip-dark border-clip-lightGray text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la vidéo"
              className="bg-clip-dark border-clip-lightGray text-white"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL de la vidéo (Méga lien)</Label>
            <Input 
              id="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="bg-clip-dark border-clip-lightGray text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL de miniature (optionnel)</Label>
            <Input 
              id="thumbnail" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="bg-clip-dark border-clip-lightGray text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as VideoCategory)}
            >
              <SelectTrigger className="bg-clip-dark border-clip-lightGray text-white">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-clip-dark border-clip-lightGray text-white">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline"
                className="bg-transparent text-white hover:bg-clip-lightGray/10"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-clip-purple hover:bg-clip-purple/90"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoForm;
