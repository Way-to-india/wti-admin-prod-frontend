import { apiClient } from '@/lib/api-client';
import type { NotificationsResponse } from '@/types/notification.types';

export const notificationService = {
  async getMyNotifications(): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>('/admin/notifications/my');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch notifications');
  },

  async markAsRead(id: string): Promise<void> {
    const response = await apiClient.patch(`/admin/notifications/${id}/read`, {});

    if (!response.status) {
      throw new Error(response.message || 'Failed to mark notification as read');
    }
  },

  async markAllAsRead(): Promise<void> {
    const response = await apiClient.patch('/admin/notifications/read-all', {});

    if (!response.status) {
      throw new Error(response.message || 'Failed to mark all as read');
    }
  },
};
