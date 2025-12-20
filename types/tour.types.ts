export interface TourItinerary {
  id?: string;
  tourId?: string;
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
  image?: File;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  metatitle: string | null;
  metadesc: string | null;
  overview: string | null;
  description: string | null;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number | null;
  currency: string;
  minGroupSize: number;
  maxGroupSize: number;
  bestTime: string | null;
  idealFor: string | null;
  difficulty: string | null;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  isActive: boolean;
  isFeatured: boolean;
  cancellationPolicy: string | null;
  travelTips: string | null;
  startCityId: string | null;
  images: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
  startCity?: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
  themes?: Array<{
    theme: {
      id: string;
      name: string;
      label: string;
      slug: string;
    };
  }>;
  cities?: Array<{
    city: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  itinerary?: TourItinerary[];
}

export interface CreateTourData {
  title: string;
  slug: string;
  metatitle?: string;
  metadesc?: string;
  overview?: string;
  description?: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice?: number;
  currency: string;
  minGroupSize: number;
  maxGroupSize: number;
  bestTime?: string;
  idealFor?: string;
  difficulty?: string;
  isActive: boolean;
  isFeatured: boolean;
  cancellationPolicy?: string;
  travelTips?: string;
  startCityId?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  images?: File[];
  coverImage?: File;
  itinerary?: TourItinerary[];
  themes?: string[];
  cities?: string[];
}

export interface UpdateTourData {
  title?: string;
  slug?: string;
  metatitle?: string;
  metadesc?: string;
  overview?: string;
  description?: string;
  durationDays?: number;
  durationNights?: number;
  price?: number;
  discountPrice?: number;
  currency?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  bestTime?: string;
  idealFor?: string;
  difficulty?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  cancellationPolicy?: string;
  travelTips?: string;
  startCityId?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: TourItinerary[];
  themes?: string[];
  cities?: string[];
  faqs?: any[];
  priceGuide?: any[];
}