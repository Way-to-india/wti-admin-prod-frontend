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
import { DraftNotification } from '@/components/tours/draft-notification';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutoSaveDraft } from '@/hooks/use-auto-save-draft';
import { tourService } from '@/services/tour.service';
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function TourCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState('');

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
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string; order: number }>>([]);

  const draftData = useMemo(() => ({
    title,
    slug,
    startCityId,
    durationDays,
    durationNights,
    overview,
    description,
    highlights,
    itinerary,
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
    faqs,
    activeTab,
  }), [
    title, slug, startCityId, durationDays, durationNights,
    overview, description, highlights, itinerary,
    bestTime, idealFor, difficulty, inclusions, exclusions,
    travelTips, cancellationPolicy, price, discountPrice,
    currency, minGroupSize, maxGroupSize, isActive, isFeatured,
    metatitle, metadesc, themes, cities, faqs, activeTab
  ]);

  // Auto-save hook
  const { loadDraft, clearDraft, hasDraft } = useAutoSaveDraft({
    key: 'tour-draft-create',
    data: draftData,
    enabled: !isSubmitting,
  });

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft()) {
      const stored = localStorage.getItem('tour-draft-create');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDraftTimestamp(parsed.timestamp);
        setShowDraftNotification(true);
      }
    }
  }, []);

  // Restore draft handler
  const handleRestoreDraft = () => {
    const draft = loadDraft<typeof draftData>();
    if (draft) {
      setTitle(draft.title || '');
      setSlug(draft.slug || '');
      setStartCityId(draft.startCityId || '');
      setDurationDays(draft.durationDays || 1);
      setDurationNights(draft.durationNights || 0);
      setOverview(draft.overview || '');
      setDescription(draft.description || '');
      setHighlights(draft.highlights || []);
      setItinerary(draft.itinerary || []);
      setBestTime(draft.bestTime || '');
      setIdealFor(draft.idealFor || '');
      setDifficulty(draft.difficulty || '');
      setInclusions(draft.inclusions || []);
      setExclusions(draft.exclusions || []);
      setTravelTips(draft.travelTips || '');
      setCancellationPolicy(draft.cancellationPolicy || '');
      setPrice(draft.price || 0);
      setDiscountPrice(draft.discountPrice || 0);
      setCurrency(draft.currency || 'INR');
      setMinGroupSize(draft.minGroupSize || 1);
      setMaxGroupSize(draft.maxGroupSize || 50);
      setIsActive(draft.isActive ?? true);
      setIsFeatured(draft.isFeatured ?? false);
      setMetatitle(draft.metatitle || '');
      setMetadesc(draft.metadesc || '');
      setThemes(draft.themes || []);
      setCities(draft.cities || []);
      setFaqs(draft.faqs || []);
      setActiveTab(draft.activeTab || 'basic');

      toast.success('Draft restored successfully!');
    }
    setShowDraftNotification(false);
  };

  // Discard draft handler
  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftNotification(false);
    toast.info('Draft discarded');
  };

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

    if (faqs.length > 0) {
      faqs.forEach((faq, index) => {
        if (!faq.question.trim()) errors.push(`FAQ ${index + 1}: Question is required`);
        if (!faq.answer.trim()) errors.push(`FAQ ${index + 1}: Answer is required`);
      });
    }

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
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      };

      await tourService.createTour(tourData);

      // Clear draft on successful creation
      clearDraft();

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
      case 'faqs':
        if (faqs.length > 0 && faqs.every((f) => f.question.trim() && f.answer.trim()))
          return 'complete';
        if (faqs.length > 0) return 'incomplete';
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

          {showDraftNotification && (
            <div className="px-4">
              <DraftNotification
                timestamp={draftTimestamp}
                onRestore={handleRestoreDraft}
                onDiscard={handleDiscardDraft}
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3 lg:grid-cols-8 p-1 h-auto">
                {[
                  { value: 'basic', label: 'Basic Info' },
                  { value: 'content', label: 'Content' },
                  { value: 'itinerary', label: 'Itinerary' },
                  { value: 'images', label: 'Images' },
                  { value: 'details', label: 'Details' },
                  { value: 'faqs', label: 'FAQs' },
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

              <TabsContent value="faqs">
                <FaqTab faqs={faqs} setFaqs={setFaqs} />
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
