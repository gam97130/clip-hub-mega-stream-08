
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Series } from '../types/video';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  thumbnail: z.string().url("L'URL de l'aperçu doit être valide").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSeriesFormProps {
  onAddSeries: (series: Omit<Series, 'id'>) => void;
}

const AddSeriesForm: React.FC<AddSeriesFormProps> = ({ onAddSeries }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnail: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const newSeries: Omit<Series, 'id'> = {
      title: values.title,
      description: values.description || undefined,
      thumbnail: values.thumbnail || undefined,
    };
    
    onAddSeries(newSeries);
    form.reset();
    toast.success('Série ajoutée avec succès!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-clip-purple text-white hover:bg-clip-purple/90">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une série
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-clip-dark border-clip-lightGray">
        <DialogHeader>
          <DialogTitle className="text-white">Ajouter une nouvelle série</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le titre de la série" {...field} className="bg-clip-gray border-clip-lightGray text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Entrez une description pour la série" {...field} className="bg-clip-gray border-clip-lightGray text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">URL de l'aperçu (optionnelle)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemple.com/image.jpg" {...field} className="bg-clip-gray border-clip-lightGray text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" className="bg-clip-purple hover:bg-clip-purple/90">
                Ajouter la série
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSeriesForm;
