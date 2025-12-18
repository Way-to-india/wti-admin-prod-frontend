'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tourService, Tour, UpdateTourData } from '@/services/tour.service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { toast } from 'sonner';
import { BasicInfoTab } from '@/components/tours/edit/tabs/basic-info-tab';
import { ContentTab } from '@/components/tours/edit/tabs/content-tab';
import { ItineraryTab } from '@/components/tours/edit/tabs/itinerary-tab';
import { DetailsTab } from '@/components/tours/edit/tabs/details-tab';
import { PricingTab } from '@/components/tours/edit/tabs/pricing-tab';
import { SettingsTab } from '@/components/tours/edit/tabs/settings-tab';
import { TourImages } from '@/components/tours/edit/tabs/tour-images';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function TourEditPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('basic');

  const [formData, setFormData] = useState<UpdateTourData>({
    title: '',
    slug: '',
    metatitle: '',
    metadesc: '',
    overview: '',
    description: '',
    durationDays: 0,
    durationNights: 0,
    price: 0,
    discountPrice: 0,
    currency: 'INR',
    minGroupSize: 1,
    maxGroupSize: 50,
    bestTime: '',
    idealFor: '',
    difficulty: '',
    isActive: true,
    isFeatured: false,
    cancellationPolicy: '',
    travelTips: '',
    startCityId: undefined,
    highlights: [],
    inclusions: [],
    exclusions: [],
  });

  useEffect(() => {
    if (params.id) {
      fetchTour(params.id as string);
    }
  }, [params.id]);

  const fetchTour = async (id: string) => {
    try {
      const data = await tourService.getTourById(id, true);
      setTour(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        overview: data.overview || '',
        description: data.description || '',
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        price: data.price,
        discountPrice: data.discountPrice || 0,
        currency: data.currency,
        minGroupSize: data.minGroupSize,
        maxGroupSize: data.maxGroupSize,
        bestTime: data.bestTime || '',
        idealFor: data.idealFor || '',
        difficulty: data.difficulty || '',
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        cancellationPolicy: data.cancellationPolicy || '',
        travelTips: data.travelTips || '',
        startCityId: data.startCityId || undefined,
        highlights: data.highlights || [],
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
      });

      if (data.itinerary && data.itinerary.length > 0) {
        setItinerary(
          data.itinerary.map((item) => ({
            day: item.day,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl || '',
          }))
        );
      }

      setImages(data.images || []);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to load tour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const cleanedData = { ...formData };

      if (itinerary.length > 0) {
        cleanedData.itinerary = itinerary;
      }

      if (!cleanedData.startCityId || cleanedData.startCityId === '') {
        delete cleanedData.startCityId;
      }

      console.log('🚀 Submitting tour data with itinerary:', cleanedData);

      await tourService.updateTour(params.id as string, cleanedData);
      toast.success('Tour updated successfully');
      router.push(`/dashboard/tours/${params.id}`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update tour');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof UpdateTourData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleItineraryChange = (newItinerary: ItineraryDay[]) => {
    setItinerary(newItinerary);
    setHasUnsavedChanges(true);
  };

  const handleTabChange = (value: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(value);
    } else {
      setCurrentTab(value);
    }
  };

  const confirmTabChange = () => {
    setHasUnsavedChanges(false);
    if (pendingTab) {
      setCurrentTab(pendingTab);
      setPendingTab(null);
    }
  };

  const cancelTabChange = () => {
    setPendingTab(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return <div className="p-8">Tour not found</div>;
  }

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="edit">
      <div className="min-h-screen">
        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
          <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Edit Tour</h1>
                  <p className="text-sm text-muted-foreground">{tour.title}</p>
                </div>
              </div>
              <Button className='cursor-pointer' type="submit" disabled={isSaving} size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger className="cursor-pointer" value="basic">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="content">
                  Content
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="itinerary">
                  Itinerary
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="images">
                  Images
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="details">
                  Details
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="pricing">
                  Pricing
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="settings">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="content">
                <ContentTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="itinerary">
                {/* 🔧 FIX 4: Use the new handler */}
                <ItineraryTab itinerary={itinerary} setItinerary={handleItineraryChange} />
              </TabsContent>

              <TabsContent value="images">
                <TourImages
                  tourId={tour.id}
                  images={images}
                  onImagesChange={(newImages) => {
                    setImages(newImages);
                    setHasUnsavedChanges(false);
                  }}
                />
              </TabsContent>

              <TabsContent value="details">
                <DetailsTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="pricing">
                <PricingTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab formData={formData} updateField={updateField} />
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </div>

      <AlertDialog open={!!pendingTab} onOpenChange={() => setPendingTab(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTabChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTabChange}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
