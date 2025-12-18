'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { tourService } from '@/services/tour.service';
import { BasicInfoTab } from '@/components/tours/create/BasicInfoTab';
import { ContentTab } from '@/components/tours/create/ContentTab';
import { ImagesTab } from '@/components/tours/create/ImagesTab';
import { ItineraryTab } from '@/components/tours/create/ItineraryTab';
import { DetailsTab } from '@/components/tours/create/DetailsTab';
import { PricingTab } from '@/components/tours/create/PricingTab';
import { SettingsTab } from '@/components/tours/create/SettingsTab';
import { toast } from 'sonner';

export default function TourCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [startCityId, setStartCityId] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [durationNights, setDurationNights] = useState(0);

  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  const [itinerary, setItinerary] = useState<
    Array<{
      day: number;
      title: string;
      description: string;
      imageUrl?: string;
      image?: File;
    }>
  >([]);

  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [bestTime, setBestTime] = useState('');
  const [idealFor, setIdealFor] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [travelTips, setTravelTips] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [maxGroupSize, setMaxGroupSize] = useState(50);

  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [metatitle, setMetatitle] = useState('');
  const [metadesc, setMetadesc] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!title.trim()) errors.push('Tour title is required');
    if (!slug.trim()) errors.push('URL slug is required');
    if (!startCityId) errors.push('Starting city is required');
    if (durationDays < 1) errors.push('Duration must be at least 1 day');

    if (!overview.trim()) errors.push('Tour overview is required');
    if (!description.trim()) errors.push('Tour description is required');
    if (highlights.length === 0) errors.push('Add at least one highlight');
    if (highlights.some((h) => !h.trim())) errors.push('All highlights must have content');

    if (itinerary.length === 0) {
      errors.push('Add at least one day to the itinerary');
    } else {
      itinerary.forEach((day, index) => {
        if (!day.title.trim()) errors.push(`Day ${index + 1}: Title is required`);
        if (!day.description.trim()) errors.push(`Day ${index + 1}: Description is required`);
      });
    }

    if (!coverImage) errors.push('Cover image is required');

    if (price <= 0) errors.push('Price must be greater than 0');
    if (discountPrice > 0 && discountPrice >= price) {
      errors.push('Discount price must be less than regular price');
    }
    if (minGroupSize < 1) errors.push('Minimum group size must be at least 1');
    if (maxGroupSize < minGroupSize) {
      errors.push('Maximum group size must be greater than minimum group size');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      toast.error('Please fix the following errors:', {
        description: (
          <ul className="mt-2 list-disc list-inside space-y-1">
            {validation.errors.slice(0, 5).map((error, index) => (
              <li key={index} className="text-sm">
                {error}
              </li>
            ))}
            {validation.errors.length > 5 && (
              <li className="text-sm">...and {validation.errors.length - 5} more</li>
            )}
          </ul>
        ),
        duration: 6000,
      });
      return;
    }

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
        highlights: highlights.filter((h) => h.trim()),
        itinerary,
        images,
        coverImage: coverImage!,
        bestTime,
        idealFor,
        difficulty,
        inclusions: inclusions.filter((i) => i.trim()),
        exclusions: exclusions.filter((e) => e.trim()),
        travelTips,
        cancellationPolicy,
        price,
        discountPrice: discountPrice > 0 ? discountPrice : undefined,
        currency,
        minGroupSize,
        maxGroupSize,
        isActive,
        isFeatured,
        metatitle: metatitle || title,
        metadesc: metadesc || overview,
        themes,
        cities,
      };

      await tourService.createTour(tourData);

      toast.success('Success!', {
        description: 'Tour created successfully!',
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      setTimeout(() => {
        router.push('/dashboard/tours');
      }, 1500);
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to create tour. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTabStatus = (tab: string): 'complete' | 'incomplete' | 'empty' => {
    switch (tab) {
      case 'basic':
        if (title && slug && startCityId) return 'complete';
        if (title || slug || startCityId) return 'incomplete';
        return 'empty';
      case 'content':
        if (overview && description && highlights.length > 0) return 'complete';
        if (overview || description || highlights.length > 0) return 'incomplete';
        return 'empty';
      case 'itinerary':
        if (itinerary.length > 0) return 'complete';
        return 'empty';
      case 'images':
        if (coverImage) return 'complete';
        if (images.length > 0) return 'incomplete';
        return 'empty';
      case 'details':
        if (inclusions.length > 0 || exclusions.length > 0) return 'incomplete';
        return 'empty';
      case 'pricing':
        if (price > 0) return 'complete';
        return 'empty';
      case 'settings':
        return 'empty';
      default:
        return 'empty';
    }
  };

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="create">
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="sticky top-0 bg-background z-50 border-b shadow-sm p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer h-9 w-9 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Create New Tour</h1>
                  <p className="text-sm text-muted-foreground">
                    Fill in all the details to create a comprehensive tour package
                  </p>
                </div>
              </div>
            </div>
            <Button className='cursor-pointer' onClick={handleSubmit} disabled={isSubmitting} size="lg">
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
              <TabsList className="mb-6 grid w-full grid-cols-3 lg:grid-cols-7 p-1 h-auto">
                {[
                  { value: 'basic', label: 'Basic Info' },
                  { value: 'content', label: 'Content' },
                  { value: 'itinerary', label: 'Itinerary' },
                  { value: 'images', label: 'Images' },
                  { value: 'details', label: 'Details' },
                  { value: 'pricing', label: 'Pricing' },
                  { value: 'settings', label: 'Settings' },
                ].map((tab) => {
                  const status = getTabStatus(tab.value);
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="cursor-pointer relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {tab.label}
                      {status === 'complete' && (
                        <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />
                      )}
                    </TabsTrigger>
                  );
                })}
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

              <TabsContent value="itinerary">
                <ItineraryTab itinerary={itinerary} setItinerary={setItinerary} />
              </TabsContent>

              <TabsContent value="images">
                <ImagesTab
                  images={images}
                  setImages={setImages}
                  coverImage={coverImage}
                  setCoverImage={setCoverImage}
                />
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
