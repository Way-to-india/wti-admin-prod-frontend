'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { Module, moduleService } from '@/services/module.service';
import { permissionService } from '@/services/permission.service';
import { Role, roleService } from '@/services/role.service';
import { isAxiosError } from 'axios';
import { Loader2, Lock, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PermissionMatrix {
  [roleId: string]: {
    [moduleId: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export default function PermissionsPage() {
  const { admin: currentAdmin } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<PermissionMatrix>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isSuperAdmin = currentAdmin?.role?.name === 'Super Admin';

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchData();
  }, [isSuperAdmin]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [rolesData, modulesData] = await Promise.all([
        roleService.getAllRoles(),
        moduleService.getAllModules(),
      ]);

      setRoles(rolesData.roles);
      setModules(modulesData.modules.sort((a, b) => a.order - b.order));

      const permissionsMatrix: PermissionMatrix = {};
      for (const role of rolesData.roles) {
        const rolePerms = await permissionService.getPermissionsByRole(role.id);
        permissionsMatrix[role.id] = {};

        for (const module of modulesData.modules) {
          const perm = rolePerms.permissions.find((p) => p.moduleId === module.id);
          permissionsMatrix[role.id][module.id] = {
            view: perm?.view || false,
            create: perm?.create || false,
            edit: perm?.edit || false,
            delete: perm?.delete || false,
          };
        }
      }

      setPermissions(permissionsMatrix);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (
    roleId: string,
    moduleId: string,
    action: 'view' | 'create' | 'edit' | 'delete',
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleId]: {
          ...prev[roleId][moduleId],
          [action]: value,
        },
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setIsSaving(true);
      const updates: Promise<any>[] = [];

      for (const roleId in permissions) {
        for (const moduleId in permissions[roleId]) {
          const perm = permissions[roleId][moduleId];
          updates.push(
            permissionService.setPermissions({
              roleId,
              moduleId,
              view: perm.view,
              create: perm.create,
              edit: perm.edit,
              delete: perm.delete,
            })
          );
        }
      }

      await Promise.all(updates);
      toast.success('Permissions saved successfully');
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Only Super Admins can manage permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto p-4 md:p-6 space-y-6">
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Configure what each role can do with each module</CardDescription>
            </div>
            <Button onClick={handleSavePermissions} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : roles.length === 0 || modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No data available</h3>
                <p className="text-sm text-muted-foreground">
                  Create roles and modules first to manage permissions
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px] bg-muted/50 font-semibold border-r sticky left-0 z-20">
                      Role / Module
                    </TableHead>
                    {modules.map((module) => (
                      <TableHead key={module.id} className="text-center min-w-[140px]">
                        {module.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium bg-muted/30 border-r sticky left-0 z-10">
                        {role.name}
                      </TableCell>
                      {modules.map((module) => (
                        <TableCell key={module.id} className="p-3 bg-background">
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors whitespace-nowrap">
                              <Checkbox
                                checked={permissions[role.id]?.[module.id]?.view || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    role.id,
                                    module.id,
                                    'view',
                                    checked as boolean
                                  )
                                }
                              />
                              <span>View</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors whitespace-nowrap">
                              <Checkbox
                                checked={permissions[role.id]?.[module.id]?.create || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    role.id,
                                    module.id,
                                    'create',
                                    checked as boolean
                                  )
                                }
                              />
                              <span>Create</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors whitespace-nowrap">
                              <Checkbox
                                checked={permissions[role.id]?.[module.id]?.edit || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    role.id,
                                    module.id,
                                    'edit',
                                    checked as boolean
                                  )
                                }
                              />
                              <span>Edit</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors whitespace-nowrap">
                              <Checkbox
                                checked={permissions[role.id]?.[module.id]?.delete || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    role.id,
                                    module.id,
                                    'delete',
                                    checked as boolean
                                  )
                                }
                              />
                              <span>Delete</span>
                            </label>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
