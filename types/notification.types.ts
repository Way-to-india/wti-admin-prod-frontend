export interface Notification {
  id: string;
  adminId: string;
  title: string;
  message: string;
  type: 'NEW_LEAD' | 'LEAD_ASSIGNED' | 'REMINDER';
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
