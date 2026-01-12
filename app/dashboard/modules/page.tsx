'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import {
  CreateModuleData,
  Module,
  moduleService,
  UpdateModuleData,
} from '@/services/module.service';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { AppWindow, Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ModulesPage() {
  const { admin: currentAdmin } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<CreateModuleData>({
    name: '',
    label: '',
    description: '',
    icon: '',
    order: 0,
  });

  const isSuperAdmin = currentAdmin?.role?.name === 'Super Admin';

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchModules();
  }, [isSuperAdmin]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await moduleService.getAllModules();
      setModules(data.modules.sort((a, b) => a.order - b.order));
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await moduleService.createModule(formData);
      toast.success('Module created successfully');
      setCreateDialogOpen(false);
      setFormData({ name: '', label: '', description: '', icon: '', order: 0 });
      fetchModules();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to create module');
    }
  };

  const handleUpdate = async () => {
    if (!selectedModule) return;
    try {
      await moduleService.updateModule(selectedModule.id, formData as UpdateModuleData);
      toast.success('Module updated successfully');
      setEditDialogOpen(false);
      setSelectedModule(null);
      setFormData({ name: '', label: '', description: '', icon: '', order: 0 });
      fetchModules();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to update module');
    }
  };

  const handleDelete = async () => {
    if (!selectedModule) return;
    try {
      await moduleService.deleteModule(selectedModule.id);
      toast.success('Module deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedModule(null);
      fetchModules();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to delete module');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Only Super Admins can manage modules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
            <p className="text-muted-foreground">Manage system modules</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AppWindow className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No modules found</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first module
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.name}</TableCell>
                        <TableCell>{module.label}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {module.icon || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={module.isActive ? 'default' : 'secondary'}>
                            {module.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(module.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedModule(module);
                                setFormData({
                                  name: module.name,
                                  label: module.label,
                                  description: module.description || '',
                                  icon: module.icon || '',
                                  order: module.order,
                                });
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedModule(module);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Module</DialogTitle>
            <DialogDescription>Add a new module to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Tours"
              />
            </div>
            <div>
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Tour Management"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., IconMap2"
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Module description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || !formData.label}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>Update module information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-label">Label *</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-icon">Icon</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-order">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.name || !formData.label}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Module</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedModule?.name}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
