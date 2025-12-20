'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tourService } from '@/services/tour.service';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { TourHeader } from '@/components/tours/view/tour-header';
import { TourStats } from '@/components/tours/view/tour-stats';
import { TourImages } from '@/components/tours/view/tour-images';
import { TourTabs } from '@/components/tours/view/tour-tabs';
import { Tour } from '@/types/tour.types';

export default function TourViewPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTour(params.id as string);
    }
  }, [params.id]);

  const fetchTour = async (id: string) => {
    try {
      const data = await tourService.getTourById(id, true);
      setTour(data);
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-30">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isLoading && !tour) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Tour not found</h2>
          <Button className="mt-4 cursor-pointer" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = hasPermission('Tours', 'edit');

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="view">
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {canEdit && tour && (
              <Button
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/tours/${tour.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Tour
              </Button>
            )}
          </div>

          <TourHeader tour={tour} />

          <TourStats tour={tour} />

          <TourImages tour={tour} />

          {tour && <TourTabs tour={tour} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
