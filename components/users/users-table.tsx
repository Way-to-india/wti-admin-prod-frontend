'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/services/user.service';
import { format } from 'date-fns';
import { Eye, Loader2, Power, PowerOff, Send, Users } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  >;
  onViewDetails: (user: User) => void;
  onSendEmail: (user: User) => void;
  onToggleStatus: (user: User) => void;
  isSuperAdmin: boolean;
  searchQuery: string;
  statusFilter: string;
}

export function UsersTable({
  users,
  isLoading,
  pagination,
  setPagination,
  onViewDetails,
  onSendEmail,
  onToggleStatus,
  isSuperAdmin,
  searchQuery,
  statusFilter,
}: UsersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No users found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No users have registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.profileImage && <AvatarImage src={user.profileImage} />}
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.phone ? `+${user.countryCode} ${user.phone}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant={user.isEmailVerified ? 'default' : 'secondary'}>
                          {user.isEmailVerified ? '✓ Email' : '✗ Email'}
                        </Badge>
                        <Badge variant={user.isPhoneVerified ? 'default' : 'secondary'}>
                          {user.isPhoneVerified ? '✓ Phone' : '✗ Phone'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user._count?.reviews || 0} reviews</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSendEmail(user)}
                          title="Send Email"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button variant="ghost" size="sm" onClick={() => onToggleStatus(user)}>
                            {user.isActive ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
            users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
