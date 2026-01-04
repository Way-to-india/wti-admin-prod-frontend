import { apiClient } from '@/lib/api-client';
import type {
  CitiesResponse,
  CityFilters,
  CreateCityData,
  CreateGuideDataData,
  CreateStateData,
  GuideDataFilters,
  GuideDataResponse,
  StateFilters,
  StatesResponse,
  TravelGuideCity,
  TravelGuideData,
  TravelGuideState,
  UpdateCityData,
  UpdateGuideDataData,
  UpdateStateData,
} from '@/types/travel-guide.types';

export const travelGuideService = {
  async getAllStates(filters: StateFilters = {}): Promise<StatesResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<StatesResponse>(
      `/admin/travel-guide/states?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch states');
  },

  async getStateById(id: string): Promise<TravelGuideState> {
    const response = await apiClient.get<TravelGuideState>(`/admin/travel-guide/states/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch state');
  },

  async createState(data: CreateStateData): Promise<TravelGuideState> {
    const response = await apiClient.post<TravelGuideState>('/admin/travel-guide/states', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create state');
  },

  async updateState(id: string, data: UpdateStateData): Promise<TravelGuideState> {
    const response = await apiClient.put<TravelGuideState>(
      `/admin/travel-guide/states/${id}`,
      data
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update state');
  },

  async deleteState(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/travel-guide/states/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete state');
    }
  },

  async getAllCities(filters: CityFilters = {}): Promise<CitiesResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.stateId) params.append('stateId', filters.stateId);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<CitiesResponse>(
      `/admin/travel-guide/cities?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch cities');
  },

  async getCityById(id: string): Promise<TravelGuideCity> {
    const response = await apiClient.get<TravelGuideCity>(`/admin/travel-guide/cities/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch city');
  },

  async createCity(data: CreateCityData): Promise<TravelGuideCity> {
    const response = await apiClient.post<TravelGuideCity>('/admin/travel-guide/cities', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create city');
  },

  async updateCity(id: string, data: UpdateCityData): Promise<TravelGuideCity> {
    const response = await apiClient.put<TravelGuideCity>(`/admin/travel-guide/cities/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update city');
  },

  async deleteCity(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/travel-guide/cities/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete city');
    }
  },

  async getAllGuideData(filters: GuideDataFilters = {}): Promise<GuideDataResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.cityId) params.append('cityId', filters.cityId);
    if (filters.stateId) params.append('stateId', filters.stateId);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<GuideDataResponse>(
      `/admin/travel-guide/guide-data?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch guide data');
  },

  async getGuideDataById(id: string): Promise<TravelGuideData> {
    const response = await apiClient.get<TravelGuideData>(`/admin/travel-guide/guide-data/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch guide data');
  },

  async createGuideData(data: CreateGuideDataData): Promise<TravelGuideData> {
    const formData = new FormData();

    formData.append('cityId', data.cityId);
    formData.append('stateId', data.stateId);

    if (data.citySlug) formData.append('citySlug', data.citySlug);
    if (data.stateSlug) formData.append('stateSlug', data.stateSlug);
    if (data.originalCityId) formData.append('originalCityId', data.originalCityId.toString());
    if (data.menuId) formData.append('menuId', data.menuId.toString());
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.introduction) formData.append('introduction', data.introduction);
    if (data.facts) formData.append('facts', data.facts);
    if (data.foodAndDining) formData.append('foodAndDining', data.foodAndDining);
    if (data.shopping) formData.append('shopping', data.shopping);
    if (data.nearbyPlaces) formData.append('nearbyPlaces', data.nearbyPlaces);
    if (data.gettingAround) formData.append('gettingAround', data.gettingAround);
    if (data.historyCulture) formData.append('historyCulture', data.historyCulture);
    if (data.otherDetails) formData.append('otherDetails', data.otherDetails);
    if (data.bestTimeToVisit) formData.append('bestTimeToVisit', data.bestTimeToVisit);
    if (data.placesToSeeTop) formData.append('placesToSeeTop', data.placesToSeeTop);
    if (data.placesToSeeBottom) formData.append('placesToSeeBottom', data.placesToSeeBottom);
    if (data.hotelDetails) formData.append('hotelDetails', data.hotelDetails);

    if (data.cityImage) {
      formData.append('cityImage', data.cityImage);
    }

    const response = await apiClient.post<TravelGuideData>(
      '/admin/travel-guide/guide-data',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create guide data');
  },

  async updateGuideData(id: string, data: UpdateGuideDataData): Promise<TravelGuideData> {
    const formData = new FormData();

    // Optional fields
    if (data.cityId) formData.append('cityId', data.cityId);
    if (data.stateId) formData.append('stateId', data.stateId);
    if (data.citySlug) formData.append('citySlug', data.citySlug);
    if (data.stateSlug) formData.append('stateSlug', data.stateSlug);
    if (data.originalCityId) formData.append('originalCityId', data.originalCityId.toString());
    if (data.menuId) formData.append('menuId', data.menuId.toString());
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.introduction) formData.append('introduction', data.introduction);
    if (data.facts) formData.append('facts', data.facts);
    if (data.foodAndDining) formData.append('foodAndDining', data.foodAndDining);
    if (data.shopping) formData.append('shopping', data.shopping);
    if (data.nearbyPlaces) formData.append('nearbyPlaces', data.nearbyPlaces);
    if (data.gettingAround) formData.append('gettingAround', data.gettingAround);
    if (data.historyCulture) formData.append('historyCulture', data.historyCulture);
    if (data.otherDetails) formData.append('otherDetails', data.otherDetails);
    if (data.bestTimeToVisit) formData.append('bestTimeToVisit', data.bestTimeToVisit);
    if (data.placesToSeeTop) formData.append('placesToSeeTop', data.placesToSeeTop);
    if (data.placesToSeeBottom) formData.append('placesToSeeBottom', data.placesToSeeBottom);
    if (data.hotelDetails) formData.append('hotelDetails', data.hotelDetails);

    // File upload
    if (data.cityImage instanceof File) {
      formData.append('cityImage', data.cityImage);
    }

    const response = await apiClient.put<TravelGuideData>(
      `/admin/travel-guide/guide-data/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update guide data');
  },

  async deleteGuideData(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/travel-guide/guide-data/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete guide data');
    }
  },

  async toggleGuideDataStatus(id: string, isActive: boolean): Promise<TravelGuideData> {
    const response = await apiClient.put<TravelGuideData>(`/admin/travel-guide/guide-data/${id}`, {
      isActive,
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update guide data status');
  },
};
