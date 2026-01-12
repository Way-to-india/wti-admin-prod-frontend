'use client';

import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { User, userService, UserStats } from '@/services/user.service';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserDetailsDialog } from '@/components/users/user-details-dialog';
import { UserFilters } from '@/components/users/user-filters';
import { UserStatsCards } from '@/components/users/user-stats';
import { UsersTable } from '@/components/users/users-table';
import EmailDialog from '@/utils/user/email-dialog';

export default function UsersPage() {
  const { admin: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const isSuperAdmin = currentAdmin?.role?.name === 'Super Admin';

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [pagination.page, debouncedSearchQuery, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      });
      console.log('data', data);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await userService.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can change user status');
      return;
    }

    try {
      await userService.updateUserStatus(user.id, !user.isActive);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to update user status');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedUser || !emailSubject || !emailMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSendingEmail(true);
      await userService.sendEmail(selectedUser.id, emailSubject, emailMessage);
      toast.success('Email sent successfully');
      setEmailDialogOpen(false);
      setEmailSubject('');
      setEmailMessage('');
      setSelectedUser(null);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage registered users ({pagination.total} total)
            </p>
          </div>
        </div>

        <UserStatsCards stats={stats} />

        <UserFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClear={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />

        <UsersTable
          users={users}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          onViewDetails={(user) => {
            setSelectedUser(user);
            setDetailsDialogOpen(true);
          }}
          onSendEmail={(user) => {
            setSelectedUser(user);
            setEmailDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          isSuperAdmin={isSuperAdmin}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>

      <UserDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        user={selectedUser}
      />

      <EmailDialog
        emailDialogOpen={emailDialogOpen}
        setEmailDialogOpen={setEmailDialogOpen}
        selectedUser={selectedUser}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailMessage={emailMessage}
        setEmailMessage={setEmailMessage}
        isSendingEmail={isSendingEmail}
        handleSendEmail={handleSendEmail}
      />
    </div>
  );
}
