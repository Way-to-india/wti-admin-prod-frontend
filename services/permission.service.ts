import { apiClient } from '@/lib/api-client';

export interface Permission {
  id: string;
  roleId: string;
  moduleId: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: string;
    name: string;
  };
  module?: {
    id: string;
    name: string;
    label: string;
  };
}

export interface PermissionsResponse {
  permissions: Permission[];
}

export interface SetPermissionData {
  roleId: string;
  moduleId: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export const permissionService = {
  async getPermissionsByRole(roleId: string): Promise<PermissionsResponse> {
    const response = await apiClient.get<PermissionsResponse>(`/admin/permission/role/${roleId}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch permissions');
  },

  async setPermissions(data: SetPermissionData): Promise<Permission> {
    const response = await apiClient.post<Permission>('/admin/permission', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to set permissions');
  },

  async deletePermission(roleId: string, moduleId: string): Promise<void> {
    const response = await apiClient.delete(`/admin/permission/${roleId}/${moduleId}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete permission');
    }
  },
};
