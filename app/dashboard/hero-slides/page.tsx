'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { HeroSlideDialog } from '@/components/hero-slides/hero-slide-dialog';
import { HeroSlidesTable } from '@/components/hero-slides/hero-slides-table';
import { Button } from '@/components/ui/button';
import { heroSlideService } from '@/services/hero-slide.service';
import { HeroSlide } from '@/types/hero-slide.types';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchSlides = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await heroSlideService.getAllHeroSlides({
        page: 1,
        limit: 50,
        sortBy: 'order',
        sortOrder: 'asc',
      });
      setSlides(response.slides);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = (id: string) => {
    setSlides(slides.filter((slide) => slide.id !== id));
    setTotal((prev) => prev - 1);
  };

  return (
    <ProtectedRoute requiredModule="Dashboard" requiredAction="view">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Hero Slides</h1>
              <p className="text-sm text-muted-foreground">
                Manage homepage hero carousel ({total} total)
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="w-fit cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchSlides} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <HeroSlidesTable slides={slides} onDelete={handleDelete} onUpdate={fetchSlides} />
          </div>
        )}

        <HeroSlideDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={fetchSlides}
        />
      </div>
    </ProtectedRoute>
  );
}
