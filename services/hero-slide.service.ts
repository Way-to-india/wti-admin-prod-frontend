import { apiClient } from '@/lib/api-client';
import { CreateHeroSlideData, HeroSlide, UpdateHeroSlideData } from '@/types/hero-slide.types';

export interface HeroSlidesResponse {
  slides: HeroSlide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HeroSlideFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const heroSlideService = {
  
  async getAllHeroSlides(filters: HeroSlideFilters = {}): Promise<HeroSlidesResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<HeroSlidesResponse>(
      `/admin/hero-slides?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch hero slides');
  },

  async getHeroSlideById(id: string): Promise<HeroSlide> {
    const response = await apiClient.get<HeroSlide>(`/admin/hero-slides/view/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch hero slide');
  },

  async createHeroSlide(data: CreateHeroSlideData): Promise<HeroSlide> {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('image', data.image);

    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.location) formData.append('location', data.location);
    if (data.duration) formData.append('duration', data.duration);
    if (data.ctaText) formData.append('ctaText', data.ctaText);
    if (data.ctaLink) formData.append('ctaLink', data.ctaLink);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.order !== undefined) formData.append('order', data.order.toString());

    const response = await apiClient.post<HeroSlide>('/admin/hero-slides/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create hero slide');
  },

  async updateHeroSlide(id: string, data: UpdateHeroSlideData): Promise<HeroSlide> {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.subtitle !== undefined) formData.append('subtitle', data.subtitle || '');
    if (data.location !== undefined) formData.append('location', data.location || '');
    if (data.duration !== undefined) formData.append('duration', data.duration || '');
    if (data.ctaText) formData.append('ctaText', data.ctaText);
    if (data.ctaLink) formData.append('ctaLink', data.ctaLink);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.order !== undefined) formData.append('order', data.order.toString());
    if (data.image) formData.append('image', data.image);

    const response = await apiClient.put<HeroSlide>(`/admin/hero-slides/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update hero slide');
  },

  async deleteHeroSlide(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/hero-slides/delete/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete hero slide');
    }
  },

  async reorderHeroSlides(slides: Array<{ id: string; order: number }>): Promise<HeroSlide[]> {
    const response = await apiClient.patch<HeroSlide[]>('/admin/hero-slides/reorder', { slides });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to reorder hero slides');
  },
};
