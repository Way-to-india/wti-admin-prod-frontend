import { apiClient } from '@/lib/api-client';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  roles: Role[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const roleService = {
  /**
   * Get all roles with optional filters
   */
  async getAllRoles(filters: RoleFilters = {}): Promise<RolesResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const response = await apiClient.get<RolesResponse>(`/admin/role?${params.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch roles');
  },

  /**
   * Get a single role by ID
   */
  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/admin/role/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch role');
  },
};
