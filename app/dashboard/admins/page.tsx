'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { adminService, Admin, AdminFilters } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Mail,
  Loader2,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateAdminDialog } from '@/components/admins/create-admin-dialog';
import { EditAdminDialog } from '@/components/admins/edit-admin-dialog';
import { DeleteAdminDialog } from '@/components/admins/delete-admin-dialog';
import { SendRequestDialog } from '@/components/admins/send-request-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function AdminsPage() {
  const { admin: currentAdmin, hasPermission } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Check if user is super admin
  const isSuperAdmin = currentAdmin?.role?.name === 'Super Admin';
  const canManageAdmins = hasPermission('Admins', 'view');

  useEffect(() => {
    fetchAdmins();
  }, [pagination.page, searchQuery, statusFilter]);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const filters: AdminFilters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      };

      const data = await adminService.getAllAdmins(filters);
      setAdmins(data.admins);
      setPagination(data.pagination);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to fetch admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (admin: Admin) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can change admin status');
      return;
    }

    try {
      await adminService.toggleAdminStatus(admin.id);
      toast.success(`Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchAdmins();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update admin status');
    }
  };

  const handleEdit = (admin: Admin) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can edit admins');
      return;
    }
    setSelectedAdmin(admin);
    setEditDialogOpen(true);
  };

  const handleDelete = (admin: Admin) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can delete admins');
      return;
    }
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleSendRequest = (admin: Admin) => {
    setSelectedAdmin(admin);
    setRequestDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate stats
  const stats = {
    total: pagination.total,
    active: admins.filter((a) => a.isActive).length,
    inactive: admins.filter((a) => !a.isActive).length,
  };

  if (!canManageAdmins) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You don&apos;t have permission to view admins.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredModule="Admins" requiredAction="view">
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
              <p className="text-muted-foreground">
                {isSuperAdmin
                  ? `Manage admin users and their permissions (${pagination.total} total)`
                  : 'View admin users and send requests'}
              </p>
            </div>
            {isSuperAdmin && hasPermission('Admins', 'create') && (
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inactive}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-45">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : admins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No admins found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Get started by creating your first admin'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{admin.name}</div>
                                <div className="text-sm text-muted-foreground">{admin.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{admin.role.name}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={admin.isActive ? 'default' : 'destructive'}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {admin.lastLoginAt
                              ? format(new Date(admin.lastLoginAt), 'MMM dd, yyyy')
                              : 'Never'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isSuperAdmin ? (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEdit(admin)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                                      {admin.isActive ? (
                                        <>
                                          <PowerOff className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Power className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(admin)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleSendRequest(admin)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Request
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} admins
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateAdminDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchAdmins}
      />

      {selectedAdmin && (
        <>
          <EditAdminDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            admin={selectedAdmin}
            onSuccess={fetchAdmins}
          />
          <DeleteAdminDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            admin={selectedAdmin}
            onSuccess={fetchAdmins}
          />
          <SendRequestDialog
            open={requestDialogOpen}
            onOpenChange={setRequestDialogOpen}
            admin={selectedAdmin}
            onSuccess={() => {
              toast.success('Request sent successfully');
              setRequestDialogOpen(false);
            }}
          />
        </>
      )}
    </ProtectedRoute>
  );
}
