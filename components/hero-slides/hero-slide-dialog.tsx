'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { heroSlideService } from '@/services/hero-slide.service';
import { CreateHeroSlideData, HeroSlide, UpdateHeroSlideData } from '@/types/hero-slide.types';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface HeroSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  slide?: HeroSlide | null;
}

export function HeroSlideDialog({ open, onOpenChange, onSuccess, slide }: HeroSlideDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    duration: '',
    ctaText: 'Explore Tours',
    ctaLink: '/india-tour-packages',
    isActive: true,
    order: 0,
    image: null as File | null,
  });

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        location: slide.location || '',
        duration: slide.duration || '',
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        isActive: slide.isActive,
        order: slide.order,
        image: null,
      });
      setImagePreview(slide.imageUrl);
    } else {
      // Reset for create
      setFormData({
        title: '',
        subtitle: '',
        location: '',
        duration: '',
        ctaText: 'Explore Tours',
        ctaLink: '/india-tour-packages',
        isActive: true,
        order: 0,
        image: null,
      });
      setImagePreview(null);
    }
  }, [slide, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slide && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      if (slide) {
        const updateData: UpdateHeroSlideData = {
          title: formData.title,
          subtitle: formData.subtitle,
          location: formData.location,
          duration: formData.duration,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          // isActive: formData.isActive,
          // order: formData.order,
        };
        if (formData.image) {
          updateData.image = formData.image;
        }
        await heroSlideService.updateHeroSlide(slide.id, updateData);
        toast.success('Hero slide updated successfully');
      } else {
        // Create
        const createData: CreateHeroSlideData = {
          title: formData.title,
          subtitle: formData.subtitle,
          location: formData.location,
          duration: formData.duration,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          // isActive: formData.isActive,
          // order: formData.order,
          image: formData.image!,
        };
        await heroSlideService.createHeroSlide(createData);
        toast.success('Hero slide created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slide ? 'Edit Hero Slide' : 'Create Hero Slide'}</DialogTitle>
          <DialogDescription>
            {slide ? 'Update the hero slide details' : 'Add a new slide to the homepage carousel'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <div className="flex flex-col gap-2">
              {imagePreview && (
                <div className="relative h-48 w-full rounded-md overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Discover the Taj Mahal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Experience the wonder of love"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Agra, India"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2-3 Days"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Explore Tours"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/india-tour-packages"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {slide ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
