import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  countryCode: number;
  profileImage: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reviews: number;
  };
}

export interface UserDetails extends User {
  profileCoverImage: string | null;
  address: string | null;
  pinCode: string | null;
  bio: string | null;
  reviews?: Array<{
    id: string;
    rating: number;
    title: string;
    comment: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    tour: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  emailVerified: number;
  phoneVerified: number;
  withReviews: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const userService = {
  async getAllUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.isEmailVerified !== undefined)
      params.append('isEmailVerified', filters.isEmailVerified.toString());
    if (filters.isPhoneVerified !== undefined)
      params.append('isPhoneVerified', filters.isPhoneVerified.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<UsersResponse>(`/admin/users?${params.toString()}`);

    console.log('users', response);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch users');
  },

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>('/admin/users/stats');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch user stats');
  },

  async getUserById(id: string): Promise<UserDetails> {
    const response = await apiClient.get<UserDetails>(`/admin/users/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch user');
  },

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    const response = await apiClient.patch<User>(`/admin/users/${id}/status`, { isActive });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update user status');
  },

  async sendEmail(id: string, subject: string, message: string): Promise<void> {
    const response = await apiClient.post(`/admin/users/${id}/send-email`, { subject, message });

    if (!response.status) {
      throw new Error(response.message || 'Failed to send email');
    }
  },
};
