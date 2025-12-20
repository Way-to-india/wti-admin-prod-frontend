import { apiClient } from '@/lib/api-client';
import { CreateTourData, Tour } from '@/types/tour.types';

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

  async createTour(data: CreateTourData): Promise<Tour> {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('durationDays', data.durationDays.toString());
    formData.append('durationNights', data.durationNights.toString());
    formData.append('price', data.price.toString());
    formData.append('currency', data.currency);
    formData.append('minGroupSize', data.minGroupSize.toString());
    formData.append('maxGroupSize', data.maxGroupSize.toString());
    formData.append('isActive', data.isActive.toString());
    formData.append('isFeatured', data.isFeatured.toString());

    if (data.metatitle) formData.append('metatitle', data.metatitle);
    if (data.metadesc) formData.append('metadesc', data.metadesc);
    if (data.overview) formData.append('overview', data.overview);
    if (data.description) formData.append('description', data.description);
    if (data.discountPrice) formData.append('discountPrice', data.discountPrice.toString());
    if (data.bestTime) formData.append('bestTime', data.bestTime);
    if (data.idealFor) formData.append('idealFor', data.idealFor);
    if (data.difficulty) formData.append('difficulty', data.difficulty);
    if (data.cancellationPolicy) formData.append('cancellationPolicy', data.cancellationPolicy);
    if (data.travelTips) formData.append('travelTips', data.travelTips);
    if (data.startCityId) formData.append('startCityId', data.startCityId);

    if (data.highlights && data.highlights.length > 0) {
      formData.append('highlights', JSON.stringify(data.highlights));
    }
    if (data.inclusions && data.inclusions.length > 0) {
      formData.append('inclusions', JSON.stringify(data.inclusions));
    }
    if (data.exclusions && data.exclusions.length > 0) {
      formData.append('exclusions', JSON.stringify(data.exclusions));
    }
    if (data.themes && data.themes.length > 0) {
      formData.append('themes', JSON.stringify(data.themes));
    }
    if (data.cities && data.cities.length > 0) {
      formData.append('cities', JSON.stringify(data.cities));
    }

    if (data.itinerary && data.itinerary.length > 0) {
      const itineraryData = data.itinerary.map(({ image, ...rest }) => rest);
      formData.append('itinerary', JSON.stringify(itineraryData));

      data.itinerary.forEach((day) => {
        if (day.image) {
          formData.append('itineraryImages', day.image);
        }
      });
    }

    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<Tour>('/admin/tours/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create tour');
  },

  /**
   * Update tour - accepts FormData directly from the component
   */
  async updateTour(id: string, formData: FormData): Promise<Tour> {
    const response = await apiClient.put<Tour>(`/admin/tours/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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
