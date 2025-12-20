import { Tour, UpdateTourData } from '@/types/tour.types';


export interface ItineraryDay {
  id? : number;
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
  image?: File;
}

export function getInitialFormData(): UpdateTourData {
  return {
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
  };
}

export function mapTourToFormData(tour: Tour): UpdateTourData {
  return {
    title: tour.title,
    slug: tour.slug,
    metatitle: tour.metatitle || '',
    metadesc: tour.metadesc || '',
    overview: tour.overview || '',
    description: tour.description || '',
    durationDays: tour.durationDays,
    durationNights: tour.durationNights,
    price: tour.price,
    discountPrice: tour.discountPrice || 0,
    currency: tour.currency,
    minGroupSize: tour.minGroupSize,
    maxGroupSize: tour.maxGroupSize,
    bestTime: tour.bestTime || '',
    idealFor: tour.idealFor || '',
    difficulty: tour.difficulty || '',
    isActive: tour.isActive,
    isFeatured: tour.isFeatured,
    cancellationPolicy: tour.cancellationPolicy || '',
    travelTips: tour.travelTips || '',
    startCityId: tour.startCityId || undefined,
    highlights: tour.highlights || [],
    inclusions: tour.inclusions || [],
    exclusions: tour.exclusions || [],
  };
}

export function mapItinerary(itinerary: any[]): ItineraryDay[] {
  return itinerary.map((item) => ({
    day: item.day,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl || '',
  }));
}
