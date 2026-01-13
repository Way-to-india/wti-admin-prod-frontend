'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess: () => void;
}

export function CreateReminderDialog({
  open,
  onOpenChange,
  leadId,
  onSuccess,
}: CreateReminderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduledFor: '',
    reminderType: 'FOLLOW_UP',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scheduledFor) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      await crmService.createReminder({
        leadId,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
        reminderType: formData.reminderType as any,
        notes: formData.notes,
      });
      toast.success('Reminder scheduled successfully');
      onSuccess();
      onOpenChange(false);
      setFormData({ scheduledFor: '', reminderType: 'FOLLOW_UP', notes: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              required
              value={formData.scheduledFor}
              onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.reminderType}
              onValueChange={(value) => setFormData({ ...formData, reminderType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                <SelectItem value="CALLBACK">Callback</SelectItem>
                <SelectItem value="QUOTE_FOLLOW_UP">Quote Follow Up</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add details about this reminder..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
