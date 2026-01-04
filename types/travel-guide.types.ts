export interface TravelGuideState {
  id: string;
  name: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  citiesCount?: number;
  dataCount?: number;
  cities?: TravelGuideCity[];
  data?: TravelGuideData[];
}

export interface CreateStateData {
  name: string;
  slug?: string;
}

export interface UpdateStateData {
  name?: string;
  slug?: string;
}

export interface TravelGuideCity {
  id: string;
  name: string;
  slug: string | null;
  stateId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  dataCount?: number;
  state?: {
    id: string;
    name: string;
    slug: string | null;
  };
  data?: TravelGuideData[];
}

export interface CreateCityData {
  name: string;
  slug?: string;
  stateId: string;
  stateName: string;
}

export interface UpdateCityData {
  name?: string;
  slug?: string;
  stateId?: string;
  stateName?: string;
}

export interface TravelGuideData {
  id: string;
  cityId: string;
  citySlug: string | null;
  stateId: string;
  stateSlug: string | null;
  originalCityId: number | null;
  menuId: number | null;
  isActive: boolean;
  introduction: string | null;
  facts: string | null;
  foodAndDining: string | null;
  shopping: string | null;
  nearbyPlaces: string | null;
  gettingAround: string | null;
  historyCulture: string | null;
  otherDetails: string | null;
  bestTimeToVisit: string | null;
  placesToSeeTop: string | null;
  placesToSeeBottom: string | null;
  hotelDetails: string | null;
  cityImage: string | null;
  createdAt: string;
  updatedAt: string;
  city?: {
    id: string;
    name: string;
    slug: string | null;
  };
  state?: {
    id: string;
    name: string;
    slug: string | null;
  };
}

export interface CreateGuideDataData {
  cityId: string;
  citySlug?: string;
  stateId: string;
  stateSlug?: string;
  originalCityId?: number;
  menuId?: number;
  isActive?: boolean;
  introduction?: string;
  facts?: string;
  foodAndDining?: string;
  shopping?: string;
  nearbyPlaces?: string;
  gettingAround?: string;
  historyCulture?: string;
  otherDetails?: string;
  bestTimeToVisit?: string;
  placesToSeeTop?: string;
  placesToSeeBottom?: string;
  hotelDetails?: string;
  cityImage?: File;
}

export interface UpdateGuideDataData {
  cityId?: string;
  citySlug?: string;
  stateId?: string;
  stateSlug?: string;
  originalCityId?: number;
  menuId?: number;
  isActive?: boolean;
  introduction?: string;
  facts?: string;
  foodAndDining?: string;
  shopping?: string;
  nearbyPlaces?: string;
  gettingAround?: string;
  historyCulture?: string;
  otherDetails?: string;
  bestTimeToVisit?: string;
  placesToSeeTop?: string;
  placesToSeeBottom?: string;
  hotelDetails?: string;
  cityImage?: File | string;
}

export interface StatesResponse {
  states: TravelGuideState[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CitiesResponse {
  cities: TravelGuideCity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GuideDataResponse {
  guideData: TravelGuideData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StateFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CityFilters {
  page?: number;
  limit?: number;
  search?: string;
  stateId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GuideDataFilters {
  page?: number;
  limit?: number;
  cityId?: string;
  stateId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
