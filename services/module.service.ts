import { apiClient } from '@/lib/api-client';

export interface Module {
  id: string;
  name: string;
  label: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface CreateModuleData {
  name: string;
  label: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface UpdateModuleData {
  name?: string;
  label?: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export const moduleService = {
  async getAllModules(isActive?: boolean): Promise<ModulesResponse> {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await apiClient.get<ModulesResponse>(`/admin/module?${params.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch modules');
  },

  async getModuleById(id: string): Promise<Module> {
    const response = await apiClient.get<Module>(`/admin/module/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch module');
  },

  async createModule(data: CreateModuleData): Promise<Module> {
    const response = await apiClient.post<Module>('/admin/module', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create module');
  },

  async updateModule(id: string, data: UpdateModuleData): Promise<Module> {
    const response = await apiClient.put<Module>(`/admin/module/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update module');
  },

  async deleteModule(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/module/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete module');
    }
  },
};
