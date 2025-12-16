'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { tourService } from '@/services/tour.service';
import { BasicInfoTab } from '@/components/tours/create/BasicInfoTab';
import { ContentTab } from '@/components/tours/create/ContentTab';
// import { ItineraryTab } from '@/components/tours/create/it';
import { ImagesTab } from '@/components/tours/create/ImagesTab';
import { DetailsTab } from '@/components/tours/create/DetailsTab';
import { PricingTab } from '@/components/tours/create/PricingTab';
import { SettingsTab } from '@/components/tours/create/SettingsTab';
import { toast } from 'sonner';

export default function TourCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Info
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [startCityId, setStartCityId] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [durationNights, setDurationNights] = useState(0);

  // Content
  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  // Itinerary
  const [itinerary, setItinerary] = useState<
    Array<{
      day: number;
      title: string;
      description: string;
      imageUrl?: string;
    }>
  >([]);

  // Images
  const [images, setImages] = useState<string[]>([]);

  // Details
  const [bestTime, setBestTime] = useState('');
  const [idealFor, setIdealFor] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [travelTips, setTravelTips] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // Pricing
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [maxGroupSize, setMaxGroupSize] = useState(50);

  // Settings
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [metatitle, setMetatitle] = useState('');
  const [metadesc, setMetadesc] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tourData = {
        title,
        slug,
        startCityId,
        durationDays,
        durationNights,
        overview,
        description,
        highlights,
        itinerary,
        images,
        bestTime,
        idealFor,
        difficulty,
        inclusions,
        exclusions,
        travelTips,
        cancellationPolicy,
        price,
        discountPrice,
        currency,
        minGroupSize,
        maxGroupSize,
        isActive,
        isFeatured,
        metatitle,
        metadesc,
        themes,
        cities,
      };

      await tourService.createTour(tourData);

      toast({
        title: 'Success',
        description: 'Tour created successfully!',
      });

      router.push('/dashboard/tours');
    } catch (error) {
      console.error('Error creating tour:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tour. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="create">
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="sticky top-0 z-50 border-b p-2 mt-2 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => router.back()} className="h-9 w-9 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Create New Tour</h1>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details to create a new tour package
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Tour
                </>
              )}
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoTab
                  title={title}
                  setTitle={setTitle}
                  slug={slug}
                  setSlug={setSlug}
                  startCityId={startCityId}
                  setStartCityId={setStartCityId}
                  durationDays={durationDays}
                  setDurationDays={setDurationDays}
                  durationNights={durationNights}
                  setDurationNights={setDurationNights}
                />
              </TabsContent>

              <TabsContent value="content">
                <ContentTab
                  overview={overview}
                  setOverview={setOverview}
                  description={description}
                  setDescription={setDescription}
                  highlights={highlights}
                  setHighlights={setHighlights}
                />
              </TabsContent>

              <TabsContent value="itinerary"></TabsContent>

              <TabsContent value="images">
                <ImagesTab images={images} setImages={setImages} />
              </TabsContent>

              <TabsContent value="details">
                <DetailsTab
                  bestTime={bestTime}
                  setBestTime={setBestTime}
                  idealFor={idealFor}
                  setIdealFor={setIdealFor}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  inclusions={inclusions}
                  setInclusions={setInclusions}
                  exclusions={exclusions}
                  setExclusions={setExclusions}
                  travelTips={travelTips}
                  setTravelTips={setTravelTips}
                  cancellationPolicy={cancellationPolicy}
                  setCancellationPolicy={setCancellationPolicy}
                />
              </TabsContent>

              <TabsContent value="pricing">
                <PricingTab
                  price={price}
                  setPrice={setPrice}
                  discountPrice={discountPrice}
                  setDiscountPrice={setDiscountPrice}
                  currency={currency}
                  setCurrency={setCurrency}
                  minGroupSize={minGroupSize}
                  setMinGroupSize={setMinGroupSize}
                  maxGroupSize={maxGroupSize}
                  setMaxGroupSize={setMaxGroupSize}
                />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab
                  isActive={isActive}
                  setIsActive={setIsActive}
                  isFeatured={isFeatured}
                  setIsFeatured={setIsFeatured}
                  metatitle={metatitle}
                  setMetatitle={setMetatitle}
                  metadesc={metadesc}
                  setMetadesc={setMetadesc}
                  themes={themes}
                  setThemes={setThemes}
                  cities={cities}
                  setCities={setCities}
                />
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
