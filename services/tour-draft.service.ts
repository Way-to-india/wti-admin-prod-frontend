import { apiClient } from '@/lib/api-client';
import { CreateTourDraftData, TourDraft } from '@/types/tour-draft.types';

export interface TourDraftsResponse {
  drafts: TourDraft[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TourDraftFilters {
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
  q?: string;
}

export const tourDraftService = {
  async getAllDrafts(filters: TourDraftFilters = {}): Promise<TourDraftsResponse> {
    return this.searchDrafts(filters);
  },

  async searchDrafts(filters: TourDraftFilters = {}): Promise<TourDraftsResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.q) params.append('q', filters.q);

    const response = await apiClient.get<TourDraftsResponse>(
      `/admin/tour-drafts/search?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch drafts');
  },

  async getDraftById(id: string): Promise<TourDraft> {
    const response = await apiClient.get<TourDraft>(`/admin/tour-drafts/view/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch draft');
  },

  async saveDraft(data: CreateTourDraftData, draftId?: string): Promise<TourDraft> {
    const url = draftId ? `/admin/tour-drafts/save?id=${draftId}` : '/admin/tour-drafts/save';

    const response = await apiClient.post<TourDraft>(url, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to save draft');
  },

  async uploadDraftImages(draftId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await apiClient.post<{ images: string[] }>(
      `/admin/tour-drafts/${draftId}/images`,
      formData
    );

    if (response.status && response.payload) {
      return response.payload.images;
    }

    throw new Error(response.message || 'Failed to upload draft images');
  },

  async deleteDraft(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/tour-drafts/delete/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete draft');
    }
  },
};
