'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { crmService } from '@/services/crm.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AssignLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  currentAssigneeId?: string | null;
  onSuccess: () => void;
}

export function AssignLeadDialog({
  open,
  onOpenChange,
  leadId,
  currentAssigneeId,
  onSuccess,
}: AssignLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(currentAssigneeId || '');
  const [notes, setNotes] = useState('');
  const [admins, setAdmins] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [fetchingAdmins, setFetchingAdmins] = useState(false);

  // Fetch admins list when dialog opens
  useEffect(() => {
    if (open) {
      setAdminId(currentAssigneeId || '');
      setNotes('');
      fetchAdmins();
    }
  }, [open, currentAssigneeId]);

  const fetchAdmins = async () => {
    try {
      setFetchingAdmins(true);
      // Use admin service to fetch admins
      const { adminService } = await import('@/services/admin.service');
      const response = await adminService.getAllAdmins();

      if (response && response.length > 0) {
        setAdmins(
          response.map((admin: any) => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
          }))
        );
      } else {
        toast.error('No admins found');
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admin list');
      // Don't use fallback mock data - show error instead
      setAdmins([]);
    } finally {
      setFetchingAdmins(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId) {
      toast.error('Please select an admin');
      return;
    }

    try {
      setLoading(true);
      await crmService.assignLead({
        leadId,
        assignedToId: adminId,
        notes: notes || undefined,
      });
      toast.success('Lead assigned successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin">Assign To</Label>
            <Select value={adminId} onValueChange={setAdminId} disabled={fetchingAdmins}>
              <SelectTrigger>
                <SelectValue placeholder={fetchingAdmins ? 'Loading admins...' : 'Select admin'} />
              </SelectTrigger>
              <SelectContent>
                {admins.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{admin.name}</span>
                      <span className="text-xs text-gray-500">{admin.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Assignment Note (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for assignment or special instructions..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
