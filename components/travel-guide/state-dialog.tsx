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
import { travelGuideService } from '@/services/travel-guide.service';
import type { TravelGuideState } from '@/types/travel-guide.types';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state?: TravelGuideState | null;
  onSuccess: () => void;
}

export function StateDialog({ open, onOpenChange, state, onSuccess }: StateDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state) {
      setName(state.name || '');
      setSlug(state.slug || '');
      setAutoSlug(false);
    } else {
      setName('');
      setSlug('');
      setAutoSlug(true);
    }
  }, [state, open]);

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
      toast.error('State name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name: name.trim(),
        slug: slug.trim() || undefined,
      };

      if (state) {
        await travelGuideService.updateState(state.id, data);
        toast.success('State updated successfully');
      } else {
        await travelGuideService.createState(data);
        toast.success('State created successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to save state');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{state ? 'Edit State' : 'Create New State'}</DialogTitle>
            <DialogDescription>
              {state
                ? 'Update the state information below.'
                : 'Add a new state to the travel guide.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                State Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Rajasthan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="rajasthan"
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
              {state ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
