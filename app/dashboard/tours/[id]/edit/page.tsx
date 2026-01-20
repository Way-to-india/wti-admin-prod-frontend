'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { DraftNotification } from '@/components/tours/draft-notification';
import { BasicInfoTab } from '@/components/tours/edit/tabs/basic-info-tab';
import { ContentTab } from '@/components/tours/edit/tabs/content-tab';
import { DetailsTab } from '@/components/tours/edit/tabs/details-tab';
import { FaqTab } from '@/components/tours/edit/tabs/faq-tab';
import { ItineraryTab } from '@/components/tours/edit/tabs/itinerary-tab';
import { PricingTab } from '@/components/tours/edit/tabs/pricing-tab';
import { SettingsTab } from '@/components/tours/edit/tabs/settings-tab';
import { TourImages } from '@/components/tours/edit/tabs/tour-images';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from '@/constants/UpdatTourTabs';
import { getInitialFormData, mapFaqs, mapItinerary, mapTourToFormData } from '@/helpers/UpdatTour';
import { useAutoSaveDraft } from '@/hooks/use-auto-save-draft';
import { tourService } from '@/services/tour.service';
import { Faq, ItineraryDay, Tour, UpdateTourData } from '@/types/tour.types';
import { isAxiosError } from 'axios';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function TourEditPage() {
  const params = useParams();
  const router = useRouter();

  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [showDraftNotification, setShowDraftNotification] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState('');

  const [originalFormData, setOriginalFormData] = useState<UpdateTourData>(getInitialFormData());
  const [originalItinerary, setOriginalItinerary] = useState<ItineraryDay[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [originalFaqs, setOriginalFaqs] = useState<Faq[]>([]);

  const [formData, setFormData] = useState<UpdateTourData>(getInitialFormData());
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // Prepare draft data (excluding File objects)
  const draftData = {
    formData,
    itinerary,
    images, // URLs only, not File objects
    faqs,
    currentTab,
  };

  // Auto-save hook with unique key per tour
  const { loadDraft, clearDraft, hasDraft } = useAutoSaveDraft({
    key: `tour-draft-edit-${params.id}`,
    data: draftData,
    enabled: !isSaving && !isLoading,
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

      const mappedFormData = mapTourToFormData(data);
      const mappedItinerary = mapItinerary(data.itinerary || []);
      const mappedImages = data.images || [];
      const mappedFaqs = mapFaqs(data.faqs || []);

      setOriginalFormData(mappedFormData);
      setOriginalItinerary(mappedItinerary);
      setOriginalImages(mappedImages);
      setOriginalFaqs(mappedFaqs);

      setFormData(mappedFormData);
      setItinerary(mappedItinerary);
      setImages(mappedImages);
      setFaqs(mappedFaqs);

      // Check for draft after loading tour data
      setTimeout(() => {
        if (hasDraft()) {
          const stored = localStorage.getItem(`tour-draft-edit-${id}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setDraftTimestamp(parsed.timestamp);
            setShowDraftNotification(true);
          }
        }
      }, 100);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to load tour');
    } finally {
      setIsLoading(false);
    }
  };

  // Restore draft handler
  const handleRestoreDraft = () => {
    const draft = loadDraft<typeof draftData>();
    if (draft) {
      if (draft.formData) setFormData(draft.formData);
      if (draft.itinerary) setItinerary(draft.itinerary);
      if (draft.images) setImages(draft.images);
      if (draft.faqs) setFaqs(draft.faqs);
      if (draft.currentTab) setCurrentTab(draft.currentTab);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = buildOptimizedFormData();

      const changedFields: string[] = [];
      for (const [key] of formDataToSend.entries()) {
        if (!changedFields.includes(key)) changedFields.push(key);
      }
      console.log('📤 Sending only changed fields:', changedFields);

      await tourService.updateTour(params.id as string, formDataToSend);

      // Clear draft on successful update
      clearDraft();

      toast.success('Tour updated successfully');
      setNewImageFiles([]);

      router.push(`/dashboard/tours/${params.id}`);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to update tour');
    } finally {
      setIsSaving(false);
    }
  };

  const buildOptimizedFormData = (): FormData => {
    const formDataToSend = new FormData();
    let hasChanges = false;

    Object.entries(formData).forEach(([key, value]) => {
      const originalValue = originalFormData[key as keyof UpdateTourData];

      const hasChanged = Array.isArray(value)
        ? JSON.stringify(value) !== JSON.stringify(originalValue)
        : value !== originalValue;

      if (hasChanged && value !== undefined && value !== null) {
        const stringValue = Array.isArray(value) ? JSON.stringify(value) : String(value);
        formDataToSend.append(key, stringValue);
        hasChanges = true;
      }
    });

    const itineraryChanged = JSON.stringify(itinerary) !== JSON.stringify(originalItinerary);
    if (itineraryChanged) {
      console.log('📋 Itinerary changed, sending update');
      formDataToSend.append('itinerary', JSON.stringify(itinerary));
      hasChanges = true;
    }

    const imagesChanged = JSON.stringify(images) !== JSON.stringify(originalImages);
    const hasNewImages = newImageFiles.length > 0;

    if (imagesChanged || hasNewImages) {
      console.log('🖼️ Images changed:', { imagesChanged, hasNewImages });
      formDataToSend.append('images', JSON.stringify(images));
      newImageFiles.forEach((file) => formDataToSend.append('images', file));
      hasChanges = true;
    }

    const faqsChanged = JSON.stringify(faqs) !== JSON.stringify(originalFaqs);
    if (faqsChanged) {
      console.log('❓ FAQs changed, sending update');
      formDataToSend.append('faqs', JSON.stringify(faqs));
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info('No changes detected');
    }

    return formDataToSend;
  };

  const updateField = (field: keyof UpdateTourData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItineraryChange = (newItinerary: ItineraryDay[]) => {
    setItinerary(newItinerary);
  };

  const handleImagesChange = (newImages: string[], newFiles: File[]) => {
    setImages(newImages);
    setNewImageFiles(newFiles);
  };

  const handleFaqsChange = (newFaqs: Faq[]) => {
    setFaqs(newFaqs);
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
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Edit Tour</h1>
                  <p className="text-sm text-muted-foreground">{tour.title}</p>
                </div>
              </div>

              <Button className="cursor-pointer" type="submit" disabled={isSaving} size="lg">
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

          {/* Tabs */}
          <div className="p-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="mb-6">
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} className="cursor-pointer" value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="content">
                <ContentTab formData={formData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="itinerary">
                <ItineraryTab itinerary={itinerary} setItinerary={handleItineraryChange} />
              </TabsContent>

              <TabsContent value="images">
                <TourImages tourId={tour.id} images={images} onImagesChange={handleImagesChange} />
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

              <TabsContent value="faqs">
                <FaqTab faqs={faqs} setFaqs={handleFaqsChange} />
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
