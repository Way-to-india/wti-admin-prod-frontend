import { apiClient } from '@/lib/api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: {
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
      permissions: Array<{
        id: string;
        roleId: string;
        moduleId: string;
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
        module: {
          id: string;
          name: string;
          label: string;
          description: string | null;
          icon: string | null;
          order: number;
        };
      }>;
    };
  };
  accessToken: string;
  refreshToken: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
    description: string | null;
    permissions: Array<{
      id: string;
      roleId: string;
      moduleId: string;
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      module: {
        id: string;
        name: string;
        label: string;
        description: string | null;
        icon: string | null;
        order: number;
      };
    }>;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/admin/auth/login', credentials);
    if (response.status && response.payload) {
      apiClient.setAccessToken(response.payload.accessToken);
      apiClient.setRefreshToken(response.payload.refreshToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem('admin', JSON.stringify(response.payload.admin));
      }

      return response.payload;
    }

    throw new Error(response.message || 'Login failed');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin');
      }
    }
  },

  async getProfile(): Promise<AdminProfile> {
    const response = await apiClient.get<AdminProfile>('/admin/auth/profile');

    if (response.status && response.payload) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin', JSON.stringify(response.payload));
      }
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch profile');
  },

  getStoredAdmin(): AdminProfile | null {
    // Check if running on server
    if (typeof window === 'undefined') return null;

    try {
      const adminStr = localStorage.getItem('admin');
      if (adminStr) {
        return JSON.parse(adminStr);
      }
      return null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    // Check if running on server
    if (typeof window === 'undefined') return false;

    return !!localStorage.getItem('accessToken');
  },

  hasPermission(moduleName: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean {
    // Check if running on server
    if (typeof window === 'undefined') return false;

    const admin = this.getStoredAdmin();
    if (!admin) return false;

    const permission = admin?.role?.permissions?.find((p) => p.module.name === moduleName);

    return permission ? permission[action] : false;
  },
};
