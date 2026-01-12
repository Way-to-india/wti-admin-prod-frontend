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

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export const roleService = {
  
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

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/admin/role/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch role');
  },

  async createRole(data: CreateRoleData): Promise<Role> {
    const response = await apiClient.post<Role>('/admin/role', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create role');
  },

  async updateRole(id: string, data: UpdateRoleData): Promise<Role> {
    const response = await apiClient.put<Role>(`/admin/role/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update role');
  },

  async deleteRole(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/role/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete role');
    }
  },
};
