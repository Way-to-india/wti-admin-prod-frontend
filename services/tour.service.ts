import { apiClient } from '@/lib/api-client';

export interface TourItinerary {
  id: string;
  tourId: string;
  day: number;
  title: string;
  description: string;
  imageUrl: string | null;
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
}

export interface ToursResponse {
  tours: Tour[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TourFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeStartCity?: boolean;
  includeThemes?: boolean;
  includeCities?: boolean;
}

export const tourService = {
  async getAllTours(filters: TourFilters = {}): Promise<ToursResponse> {
    const params = new URLSearchParams();

    // Add filters to params
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.isFeatured !== undefined)
      params.append('isFeatured', filters.isFeatured.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.includeStartCity) params.append('includeStartCity', 'true');
    if (filters.includeThemes) params.append('includeThemes', 'true');
    if (filters.includeCities) params.append('includeCities', 'true');

    const response = await apiClient.get<ToursResponse>(`/admin/tours?${params.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch tours');
  },

  async getTourById(id: string, includeAll: boolean = false): Promise<Tour> {
    const params = includeAll ? '?includeAll=true' : '';
    const response = await apiClient.get<Tour>(`/admin/tours/view/${id}${params}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch tour');
  },

  async updateTour(id: string, data: UpdateTourData): Promise<Tour> {
    const response = await apiClient.put<Tour>(`/admin/tours/edit/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update tour');
  },

  async deleteTour(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/tours/delete/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete tour');
    }
  },

  async toggleTourStatus(id: string, isActive: boolean): Promise<Tour> {
    const response = await apiClient.put<Tour>(`/admin/tours/${id}`, { isActive });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update tour status');
  },
};
