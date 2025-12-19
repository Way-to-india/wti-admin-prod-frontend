'use client';

import { useState } from 'react';
import { adminService, Admin } from '@/services/admin.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SendRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin;
  onSuccess: () => void;
}

export function SendRequestDialog({
  open,
  onOpenChange,
  admin,
  onSuccess,
}: SendRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestType: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await adminService.sendRequestToSuperAdmin(formData);
      toast.success('Request sent successfully to super admin');
      setFormData({ requestType: '', subject: '', message: '' });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send Request to Super Admin</DialogTitle>
            <DialogDescription>
              Send a request regarding <strong>{admin.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type *</Label>
              <Select
                value={formData.requestType}
                onValueChange={(value) => setFormData({ ...formData, requestType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit_permission">Edit Permission Request</SelectItem>
                  <SelectItem value="deactivate">Deactivate Admin Request</SelectItem>
                  <SelectItem value="delete">Delete Admin Request</SelectItem>
                  <SelectItem value="role_change">Role Change Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your request"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide details about your request..."
                rows={6}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
