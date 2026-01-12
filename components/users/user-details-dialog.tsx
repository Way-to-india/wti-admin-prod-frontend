'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '@/services/user.service';
import { format } from 'date-fns';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View user information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user.profileImage && <AvatarImage src={user.profileImage} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm font-medium">
                {user.phone ? `+${user.countryCode} ${user.phone}` : 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email Verified:</span>
              <Badge variant={user.isEmailVerified ? 'default' : 'secondary'}>
                {user.isEmailVerified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone Verified:</span>
              <Badge variant={user.isPhoneVerified ? 'default' : 'secondary'}>
                {user.isPhoneVerified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Reviews:</span>
              <span className="text-sm font-medium">{user._count?.reviews || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Joined:</span>
              <span className="text-sm font-medium">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
