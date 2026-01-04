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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { travelGuideService } from '@/services/travel-guide.service';
import type { TravelGuideCity, TravelGuideState } from '@/types/travel-guide.types';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city?: TravelGuideCity | null;
  states: TravelGuideState[];
  onSuccess: () => void;
}

export function CityDialog({ open, onOpenChange, city, states, onSuccess }: CityDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [stateId, setStateId] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (city) {
      setName(city.name || '');
      setSlug(city.slug || '');
      setStateId(city.stateId || '');
      setAutoSlug(false);
    } else {
      setName('');
      setSlug('');
      setStateId('');
      setAutoSlug(true);
    }
  }, [city, open]);

  useEffect(() => {
    if (autoSlug && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('City name is required');
      return;
    }

    if (!stateId) {
      toast.error('Please select a state');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedState = states.find((s) => s.id === stateId);
      if (!selectedState) {
        throw new Error('Selected state not found');
      }

      const data = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        stateId,
        stateName: selectedState.name,
      };

      if (city) {
        await travelGuideService.updateCity(city.id, data);
        toast.success('City updated successfully');
      } else {
        await travelGuideService.createCity(data);
        toast.success('City created successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to save city');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{city ? 'Edit City' : 'Create New City'}</DialogTitle>
            <DialogDescription>
              {city ? 'Update the city information below.' : 'Add a new city to the travel guide.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                City Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Jaipur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="state">
                State <span className="text-destructive">*</span>
              </Label>
              <Select value={stateId} onValueChange={setStateId} required>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="jaipur"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoSlug(false);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from name
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {city ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
