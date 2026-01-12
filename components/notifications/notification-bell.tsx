'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationService } from '@/services/notification.service';
import { Notification } from '@/types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, ExternalLink, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      notificationService.markAsRead(notification.id).catch(console.error);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 border-none bg-transparent"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="p-4 font-semibold">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center p-4">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        !notification.isRead ? 'text-primary' : ''
                      }`}
                    >
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full hover:bg-primary/10"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="mt-1 flex w-full items-center justify-between text-[10px] text-muted-foreground/70">
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {notification.link && <ExternalLink className="h-2 w-2" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="p-2 text-center flex justify-center text-xs text-muted-foreground"
          disabled
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
