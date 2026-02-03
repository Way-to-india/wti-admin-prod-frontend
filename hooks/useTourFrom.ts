import { useState } from 'react';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
  image?: File;
}

export interface FAQ {
  question: string;
  answer: string;
  order: number;
}

export interface TourFormData {
  title: string;
  slug: string;
  startCityId: string;
  durationDays: number;
  durationNights: number;

  overview: string;
  description: string;
  highlights: string[];

  itinerary: ItineraryDay[];

  images: (File | string)[];
  coverImage: File | string | null;

  bestTime: string;
  idealFor: string;
  difficulty: string;
  inclusions: string[];
  exclusions: string[];
  travelTips: string;
  cancellationPolicy: string;

  price: number;
  discountPrice: number;
  currency: string;
  minGroupSize: number;
  maxGroupSize: number;

  isActive: boolean;
  isFeatured: boolean;
  metatitle: string;
  metadesc: string;
  themes: string[];
  cities: string[];
  faqs: FAQ[];
}

export function useTourForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [startCityId, setStartCityId] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [durationNights, setDurationNights] = useState(0);

  const [overview, setOverview] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  const [images, setImages] = useState<(File | string)[]>([]);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);

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
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const formData: TourFormData = {
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
    coverImage,
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
  };

  const setFormData = (data: Partial<TourFormData>) => {
    if (data.title !== undefined) setTitle(data.title);
    if (data.slug !== undefined) setSlug(data.slug);
    if (data.startCityId !== undefined) setStartCityId(data.startCityId);
    if (data.durationDays !== undefined) setDurationDays(data.durationDays);
    if (data.durationNights !== undefined) setDurationNights(data.durationNights);
    if (data.overview !== undefined) setOverview(data.overview);
    if (data.description !== undefined) setDescription(data.description);
    if (data.highlights !== undefined) setHighlights(data.highlights);
    if (data.itinerary !== undefined) setItinerary(data.itinerary);
    if (data.bestTime !== undefined) setBestTime(data.bestTime);
    if (data.idealFor !== undefined) setIdealFor(data.idealFor);
    if (data.difficulty !== undefined) setDifficulty(data.difficulty);
    if (data.inclusions !== undefined) setInclusions(data.inclusions);
    if (data.exclusions !== undefined) setExclusions(data.exclusions);
    if (data.travelTips !== undefined) setTravelTips(data.travelTips);
    if (data.cancellationPolicy !== undefined) setCancellationPolicy(data.cancellationPolicy);
    if (data.price !== undefined) setPrice(data.price);
    if (data.discountPrice !== undefined) setDiscountPrice(data.discountPrice);
    if (data.currency !== undefined) setCurrency(data.currency);
    if (data.minGroupSize !== undefined) setMinGroupSize(data.minGroupSize);
    if (data.maxGroupSize !== undefined) setMaxGroupSize(data.maxGroupSize);
    if (data.isActive !== undefined) setIsActive(data.isActive);
    if (data.isFeatured !== undefined) setIsFeatured(data.isFeatured);
    if (data.metatitle !== undefined) setMetatitle(data.metatitle);
    if (data.metadesc !== undefined) setMetadesc(data.metadesc);
    if (data.themes !== undefined) setThemes(data.themes);
    if (data.cities !== undefined) setCities(data.cities);
    if (data.faqs !== undefined) setFaqs(data.faqs);
    if (data.images !== undefined) setImages(data.images);
    if (data.coverImage !== undefined) setCoverImage(data.coverImage);
  };

  return {
    formData,
    setFormData,

    title,
    setTitle,
    slug,
    setSlug,
    startCityId,
    setStartCityId,
    durationDays,
    setDurationDays,
    durationNights,
    setDurationNights,

    overview,
    setOverview,
    description,
    setDescription,
    highlights,
    setHighlights,

    itinerary,
    setItinerary,

    images,
    setImages,
    coverImage,
    setCoverImage,

    bestTime,
    setBestTime,
    idealFor,
    setIdealFor,
    difficulty,
    setDifficulty,
    inclusions,
    setInclusions,
    exclusions,
    setExclusions,
    travelTips,
    setTravelTips,
    cancellationPolicy,
    setCancellationPolicy,

    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    currency,
    setCurrency,
    minGroupSize,
    setMinGroupSize,
    maxGroupSize,
    setMaxGroupSize,
    // Settings
    isActive,
    setIsActive,
    isFeatured,
    setIsFeatured,
    metatitle,
    setMetatitle,
    metadesc,
    setMetadesc,
    themes,
    setThemes,
    cities,
    setCities,
    faqs,
    setFaqs,
  };
}
