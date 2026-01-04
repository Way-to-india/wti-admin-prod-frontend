'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { travelGuideService } from '@/services/travel-guide.service';
import type {
  CreateGuideDataData,
  TravelGuideCity,
  TravelGuideData,
  TravelGuideState,
  UpdateGuideDataData,
} from '@/types/travel-guide.types';
import { isAxiosError } from 'axios';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface GuideDataFormProps {
  guideData?: TravelGuideData | null;
  mode: 'create' | 'edit';
}

export function GuideDataForm({ guideData, mode }: GuideDataFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [states, setStates] = useState<TravelGuideState[]>([]);
  const [cities, setCities] = useState<TravelGuideCity[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Form state
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [introduction, setIntroduction] = useState('');
  const [facts, setFacts] = useState('');
  const [foodAndDining, setFoodAndDining] = useState('');
  const [shopping, setShopping] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState('');
  const [gettingAround, setGettingAround] = useState('');
  const [historyCulture, setHistoryCulture] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [placesToSeeTop, setPlacesToSeeTop] = useState('');
  const [placesToSeeBottom, setPlacesToSeeBottom] = useState('');
  const [hotelDetails, setHotelDetails] = useState('');
  const [cityImage, setCityImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Load existing data
  useEffect(() => {
    if (guideData) {
      setStateId(guideData.stateId);
      setCityId(guideData.cityId);
      setIsActive(guideData.isActive);
      setIntroduction(guideData.introduction || '');
      setFacts(guideData.facts || '');
      setFoodAndDining(guideData.foodAndDining || '');
      setShopping(guideData.shopping || '');
      setNearbyPlaces(guideData.nearbyPlaces || '');
      setGettingAround(guideData.gettingAround || '');
      setHistoryCulture(guideData.historyCulture || '');
      setOtherDetails(guideData.otherDetails || '');
      setBestTimeToVisit(guideData.bestTimeToVisit || '');
      setPlacesToSeeTop(guideData.placesToSeeTop || '');
      setPlacesToSeeBottom(guideData.placesToSeeBottom || '');
      setHotelDetails(guideData.hotelDetails || '');
      setExistingImageUrl(guideData.cityImage);
    }
  }, [guideData]);

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await travelGuideService.getAllStates({ limit: 100 });
        setStates(response.states);
      } catch (err) {
        toast.error('Failed to load states');
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (stateId) {
      const fetchCities = async () => {
        setIsLoadingCities(true);
        try {
          const response = await travelGuideService.getAllCities({
            stateId,
            limit: 1000,
          });
          setCities(response.cities);
        } catch (err) {
          toast.error('Failed to load cities');
        } finally {
          setIsLoadingCities(false);
        }
      };

      fetchCities();
    } else {
      setCities([]);
      setCityId('');
    }
  }, [stateId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCityImage(file);
      // Clear existing image when new one is selected
      setExistingImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stateId || !cityId) {
      toast.error('Please select both state and city');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCity = cities.find((c) => c.id === cityId);
      const selectedState = states.find((s) => s.id === stateId);

      const data: CreateGuideDataData | UpdateGuideDataData = {
        cityId,
        citySlug: selectedCity?.slug || undefined,
        stateId,
        stateSlug: selectedState?.slug || undefined,
        isActive,
        introduction: introduction || undefined,
        facts: facts || undefined,
        foodAndDining: foodAndDining || undefined,
        shopping: shopping || undefined,
        nearbyPlaces: nearbyPlaces || undefined,
        gettingAround: gettingAround || undefined,
        historyCulture: historyCulture || undefined,
        otherDetails: otherDetails || undefined,
        bestTimeToVisit: bestTimeToVisit || undefined,
        placesToSeeTop: placesToSeeTop || undefined,
        placesToSeeBottom: placesToSeeBottom || undefined,
        hotelDetails: hotelDetails || undefined,
        cityImage: cityImage || undefined,
      };

      if (mode === 'create') {
        await travelGuideService.createGuideData(data as CreateGuideDataData);
        toast.success('Guide data created successfully');
        router.push('/dashboard/travel-guide/guide-data');
      } else if (guideData) {
        await travelGuideService.updateGuideData(guideData.id, data as UpdateGuideDataData);
        toast.success('Guide data updated successfully');
        router.push(`/dashboard/travel-guide/guide-data/${guideData.id}`);
      }
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || `Failed to ${mode} guide data`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="travel">Travel Info</TabsTrigger>
          <TabsTrigger value="places">Places</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Select the city and state for this guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={stateId}
                    onValueChange={setStateId}
                    disabled={isLoadingStates}
                    required
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
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

                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={cityId}
                    onValueChange={setCityId}
                    disabled={!stateId || isLoadingCities}
                    required
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityImage">City Image</Label>
                <div className="flex flex-col gap-3">
                  {(existingImageUrl || cityImage) && (
                    <div className="relative w-full max-w-md h-48">
                      <Image
                        src={cityImage ? URL.createObjectURL(cityImage) : existingImageUrl!}
                        alt="City preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setCityImage(null);
                          setExistingImageUrl(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="cityImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
                <Input
                  id="bestTimeToVisit"
                  placeholder="e.g., October to March"
                  value={bestTimeToVisit}
                  onChange={(e) => setBestTimeToVisit(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Introduction & Facts Tab */}
        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Introduction & Facts</CardTitle>
              <CardDescription>Provide an overview of the destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="introduction">Introduction</Label>
                <Textarea
                  id="introduction"
                  placeholder="Write an engaging introduction..."
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facts">Facts</Label>
                <Textarea
                  id="facts"
                  placeholder="Interesting facts about the destination..."
                  value={facts}
                  onChange={(e) => setFacts(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Information Tab */}
        <TabsContent value="travel">
          <Card>
            <CardHeader>
              <CardTitle>Travel Information</CardTitle>
              <CardDescription>Details about food, shopping, and transportation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foodAndDining">Food & Dining</Label>
                <Textarea
                  id="foodAndDining"
                  placeholder="Best places to eat and local cuisine..."
                  value={foodAndDining}
                  onChange={(e) => setFoodAndDining(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopping">Shopping</Label>
                <Textarea
                  id="shopping"
                  placeholder="Shopping destinations and local markets..."
                  value={shopping}
                  onChange={(e) => setShopping(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gettingAround">Getting Around</Label>
                <Textarea
                  id="gettingAround"
                  placeholder="Transportation options and tips..."
                  value={gettingAround}
                  onChange={(e) => setGettingAround(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historyCulture">History & Culture</Label>
                <Textarea
                  id="historyCulture"
                  placeholder="Historical and cultural information..."
                  value={historyCulture}
                  onChange={(e) => setHistoryCulture(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Places to See Tab */}
        <TabsContent value="places">
          <Card>
            <CardHeader>
              <CardTitle>Places to See</CardTitle>
              <CardDescription>Attractions and nearby destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="placesToSeeTop">Places to See (Top Section)</Label>
                <Textarea
                  id="placesToSeeTop"
                  placeholder="Top attractions and must-visit places..."
                  value={placesToSeeTop}
                  onChange={(e) => setPlacesToSeeTop(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placesToSeeBottom">Places to See (Bottom Section)</Label>
                <Textarea
                  id="placesToSeeBottom"
                  placeholder="Additional places of interest..."
                  value={placesToSeeBottom}
                  onChange={(e) => setPlacesToSeeBottom(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nearbyPlaces">Nearby Places</Label>
                <Textarea
                  id="nearbyPlaces"
                  placeholder="Places to visit nearby..."
                  value={nearbyPlaces}
                  onChange={(e) => setNearbyPlaces(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Details Tab */}
        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Hotel information and other details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotelDetails">Hotel Details</Label>
                <Textarea
                  id="hotelDetails"
                  placeholder="Accommodation options and recommendations..."
                  value={hotelDetails}
                  onChange={(e) => setHotelDetails(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherDetails">Other Details</Label>
                <Textarea
                  id="otherDetails"
                  placeholder="Any other important information..."
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 justify-end sticky bottom-0 bg-background p-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </form>
  );
}
