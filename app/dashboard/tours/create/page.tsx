'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { BasicInfoTab } from '@/components/tours/create/BasicInfoTab';
import { ContentTab } from '@/components/tours/create/ContentTab';
import { DetailsTab } from '@/components/tours/create/DetailsTab';
import { FaqTab } from '@/components/tours/create/FaqTab';
import { ImagesTab } from '@/components/tours/create/ImagesTab';
import { ItineraryTab } from '@/components/tours/create/ItineraryTab';
import { PricingTab } from '@/components/tours/create/PricingTab';
import { SettingsTab } from '@/components/tours/create/SettingsTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTabStatus, validateTourForm } from '@/helpers/validateTour';
import { useTourForm } from '@/hooks/useTourFrom';
import { tourDraftService } from '@/services/tour-draft.service';
import { tourService } from '@/services/tour.service';
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Suspense } from 'react';

function CreateTourForm() {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [loadedDraftId, setLoadedDraftId] = useState<string | null>(null);

  const tourForm = useTourForm();

  // Load draft from database if draftId is present
  useEffect(() => {
    if (draftId) {
      loadDraftFromDatabase(draftId);
    }
  }, [draftId]);

  const loadDraftFromDatabase = async (id: string) => {
    try {
      const draft = await tourDraftService.getDraftById(id);
      const draftData = draft.draftData;

      tourForm.setFormData({
        title: draftData.title || '',
        slug: draftData.slug || '',
        startCityId: draftData.startCityId || '',
        durationDays: draftData.durationDays || 1,
        durationNights: draftData.durationNights || 0,
        overview: draftData.overview || '',
        description: draftData.description || '',
        highlights: draftData.highlights || [],
        itinerary: (draftData.itinerary || []).map((day: any) => ({
          day: day.day,
          title: day.title,
          description: day.description,
          imageUrl: day.imageUrl,
          image: undefined,
        })),
        bestTime: draftData.bestTime || '',
        idealFor: draftData.idealFor || '',
        difficulty: draftData.difficulty || '',
        inclusions: draftData.inclusions || [],
        exclusions: draftData.exclusions || [],
        travelTips: draftData.travelTips || '',
        cancellationPolicy: draftData.cancellationPolicy || '',
        price: draftData.price || 0,
        discountPrice: draftData.discountPrice || 0,
        currency: draftData.currency || 'INR',
        minGroupSize: draftData.minGroupSize || 1,
        maxGroupSize: draftData.maxGroupSize || 50,
        isActive: draftData.isActive ?? true,
        isFeatured: draftData.isFeatured ?? false,
        metatitle: draftData.metatitle || '',
        metadesc: draftData.metadesc || '',
        themes: draftData.themes || [],
        cities: draftData.cities || [],
        faqs: draftData.faqs || [],
      });

      setActiveTab(draftData.activeTab || 'basic');
      setLoadedDraftId(id);
      toast.success('Draft loaded successfully!');
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error((error as Error).message || 'Failed to load draft');
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const draftData = {
        title: tourForm.title,
        slug: tourForm.slug,
        startCityId: tourForm.startCityId,
        durationDays: tourForm.durationDays,
        durationNights: tourForm.durationNights,
        overview: tourForm.overview,
        description: tourForm.description,
        highlights: tourForm.highlights,
        itinerary: tourForm.itinerary,
        bestTime: tourForm.bestTime,
        idealFor: tourForm.idealFor,
        difficulty: tourForm.difficulty,
        inclusions: tourForm.inclusions,
        exclusions: tourForm.exclusions,
        travelTips: tourForm.travelTips,
        cancellationPolicy: tourForm.cancellationPolicy,
        price: tourForm.price,
        discountPrice: tourForm.discountPrice,
        currency: tourForm.currency,
        minGroupSize: tourForm.minGroupSize,
        maxGroupSize: tourForm.maxGroupSize,
        isActive: tourForm.isActive,
        isFeatured: tourForm.isFeatured,
        metatitle: tourForm.metatitle,
        metadesc: tourForm.metadesc,
        themes: tourForm.themes,
        cities: tourForm.cities,
        faqs: tourForm.faqs,
        activeTab,
      };

      const savedDraft = await tourDraftService.saveDraft(
        {
          draftData,
          title: tourForm.title || 'Untitled Tour Draft',
        },
        loadedDraftId || undefined
      );

      setLoadedDraftId(savedDraft.id);
      toast.success('Draft saved successfully!', {
        description: 'Your progress has been saved to drafts',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error((error as Error).message || 'Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTourForm(tourForm.formData);
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
        title: tourForm.title,
        slug: tourForm.slug,
        startCityId: tourForm.startCityId,
        durationDays: tourForm.durationDays,
        durationNights: tourForm.durationNights,
        overview: tourForm.overview,
        description: tourForm.description,
        highlights: tourForm.highlights.filter((h) => h.trim()),
        itinerary: tourForm.itinerary,
        images: tourForm.images,
        coverImage: tourForm.coverImage!,
        bestTime: tourForm.bestTime,
        idealFor: tourForm.idealFor,
        difficulty: tourForm.difficulty,
        inclusions: tourForm.inclusions.filter((i) => i.trim()),
        exclusions: tourForm.exclusions.filter((e) => e.trim()),
        travelTips: tourForm.travelTips,
        cancellationPolicy: tourForm.cancellationPolicy,
        price: tourForm.price,
        discountPrice: tourForm.discountPrice > 0 ? tourForm.discountPrice : undefined,
        currency: tourForm.currency,
        minGroupSize: tourForm.minGroupSize,
        maxGroupSize: tourForm.maxGroupSize,
        isActive: tourForm.isActive,
        isFeatured: tourForm.isFeatured,
        metatitle: tourForm.metatitle || tourForm.title,
        metadesc: tourForm.metadesc || tourForm.overview,
        themes: tourForm.themes,
        cities: tourForm.cities,
        faqs: tourForm.faqs.filter((f) => f.question.trim() && f.answer.trim()),
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

  const tabs = [
    { value: 'basic', label: 'Basic Info' },
    { value: 'content', label: 'Content' },
    { value: 'itinerary', label: 'Itinerary' },
    { value: 'images', label: 'Images' },
    { value: 'details', label: 'Details' },
    { value: 'faqs', label: 'FAQs' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="sticky top-0 bg-background z-50 border-b shadow-sm p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="cursor-pointer h-9 w-9 p-0"
              >
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
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting || isSavingDraft}
              size="lg"
              className="cursor-pointer"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
            >
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
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 lg:grid-cols-8 p-1 h-auto">
              {tabs.map((tab) => {
                const status = getTabStatus(tab.value, tourForm.formData);
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
                title={tourForm.title}
                setTitle={tourForm.setTitle}
                slug={tourForm.slug}
                setSlug={tourForm.setSlug}
                startCityId={tourForm.startCityId}
                setStartCityId={tourForm.setStartCityId}
                durationDays={tourForm.durationDays}
                setDurationDays={tourForm.setDurationDays}
                durationNights={tourForm.durationNights}
                setDurationNights={tourForm.setDurationNights}
              />
            </TabsContent>

            <TabsContent value="content">
              <ContentTab
                overview={tourForm.overview}
                setOverview={tourForm.setOverview}
                description={tourForm.description}
                setDescription={tourForm.setDescription}
                highlights={tourForm.highlights}
                setHighlights={tourForm.setHighlights}
              />
            </TabsContent>

            <TabsContent value="itinerary">
              <ItineraryTab itinerary={tourForm.itinerary} setItinerary={tourForm.setItinerary} />
            </TabsContent>

            <TabsContent value="images">
              <ImagesTab
                images={tourForm.images}
                setImages={tourForm.setImages}
                coverImage={tourForm.coverImage}
                setCoverImage={tourForm.setCoverImage}
              />
            </TabsContent>

            <TabsContent value="details">
              <DetailsTab
                bestTime={tourForm.bestTime}
                setBestTime={tourForm.setBestTime}
                idealFor={tourForm.idealFor}
                setIdealFor={tourForm.setIdealFor}
                difficulty={tourForm.difficulty}
                setDifficulty={tourForm.setDifficulty}
                inclusions={tourForm.inclusions}
                setInclusions={tourForm.setInclusions}
                exclusions={tourForm.exclusions}
                setExclusions={tourForm.setExclusions}
                travelTips={tourForm.travelTips}
                setTravelTips={tourForm.setTravelTips}
                cancellationPolicy={tourForm.cancellationPolicy}
                setCancellationPolicy={tourForm.setCancellationPolicy}
              />
            </TabsContent>

            <TabsContent value="faqs">
              <FaqTab faqs={tourForm.faqs} setFaqs={tourForm.setFaqs} />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingTab
                price={tourForm.price}
                setPrice={tourForm.setPrice}
                discountPrice={tourForm.discountPrice}
                setDiscountPrice={tourForm.setDiscountPrice}
                currency={tourForm.currency}
                setCurrency={tourForm.setCurrency}
                minGroupSize={tourForm.minGroupSize}
                setMinGroupSize={tourForm.setMinGroupSize}
                maxGroupSize={tourForm.maxGroupSize}
                setMaxGroupSize={tourForm.setMaxGroupSize}
              />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab
                isActive={tourForm.isActive}
                setIsActive={tourForm.setIsActive}
                isFeatured={tourForm.isFeatured}
                setIsFeatured={tourForm.setIsFeatured}
                metatitle={tourForm.metatitle}
                setMetatitle={tourForm.setMetatitle}
                metadesc={tourForm.metadesc}
                setMetadesc={tourForm.setMetadesc}
                themes={tourForm.themes}
                setThemes={tourForm.setThemes}
                cities={tourForm.cities}
                setCities={tourForm.setCities}
              />
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}

export default function TourCreatePage() {
  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="create">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CreateTourForm />
      </Suspense>
    </ProtectedRoute>
  );
}
