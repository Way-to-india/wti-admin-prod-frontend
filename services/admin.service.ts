import { apiClient } from '@/lib/api-client';

export interface Admin  {
  id: string;
  name: string;
  email: string;
  roleId: string; 
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
}

export interface AdminsResponse {
  admins: Admin[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface AdminRequest {
  id: string;
  adminId: string;
  requestType: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export const adminService = {

  async getAllAdmins(filters: AdminFilters = {}): Promise<AdminsResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.roleId) params.append('roleId', filters.roleId);

    const response = await apiClient.get<AdminsResponse>(`/admin/admin?${params.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch admins');
  },

  async getAdminById(id: string): Promise<Admin> {
    const response = await apiClient.get<Admin>(`/admin/admin/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch admin');
  },

  /**
   * Create a new admin
   */
  async createAdmin(data: CreateAdminData): Promise<Admin> {
    const response = await apiClient.post<Admin>('/admin/admin/create', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create admin');
  },

  /**
   * Update an existing admin
   */
  async updateAdmin(id: string, data: UpdateAdminData): Promise<Admin> {
    const response = await apiClient.put<Admin>(`/admin/admin/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update admin');
  },

  /**
   * Delete an admin
   */
  async deleteAdmin(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/admin/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete admin');
    }
  },

  /**
   * Toggle admin active status
   */
  async toggleAdminStatus(id: string): Promise<Admin> {
    const response = await apiClient.patch<Admin>(`/admin/admin/${id}/toggle-status`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to toggle admin status');
  },

  /**
   * Send request to super admin (for non-super admins)
   */
  async sendRequestToSuperAdmin(data: {
    requestType: string;
    subject: string;
    message: string;
  }): Promise<AdminRequest> {
    const response = await apiClient.post<AdminRequest>('/admin/requests', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to send request');
  },
};
