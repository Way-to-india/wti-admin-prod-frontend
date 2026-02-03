export interface FaqQuestion {
  id?: string;
  faqId?: string;
  question: string;
  answer: string;
  order: number;
}

export interface Faq {
  id?: string;
  tourId?: string;
  isActive: boolean;
  questions: FaqQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ItineraryDay {
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
  itinerary?: ItineraryDay[];
  faqs?: Faq[];
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
  images?: (File | string)[];
  coverImage?: File | string;
  itinerary?: ItineraryDay[];
  themes?: string[];
  cities?: string[];
  faqs?: Array<{ question: string; answer: string; order: number }>;
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
  itinerary?: ItineraryDay[];
  themes?: string[];
  cities?: string[];
  faqs?: any[];
  priceGuide?: any[];
}
