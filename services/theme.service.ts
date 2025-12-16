import { apiClient } from '@/lib/api-client';

export interface Theme {
  id: string;
  name: string;
  label?: string;
  slug?: string;
}

export interface ThemesResponse {
  themes: Theme[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const themeService = {
  async getAllThemes(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ThemesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiClient.get<ThemesResponse>(`/common/theme?${queryParams.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch themes');
  },

  async getThemeById(id: string): Promise<Theme> {
    const response = await apiClient.get<Theme>(`/admin/themes/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch theme');
  },
};
