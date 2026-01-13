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

interface LogCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess: () => void;
}

export function LogCommunicationDialog({
  open,
  onOpenChange,
  leadId,
  onSuccess,
}: LogCommunicationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CALL',
    direction: 'OUTBOUND',
    subject: '',
    content: '',
    duration: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      toast.error('Please select a communication type');
      return;
    }

    try {
      setLoading(true);
      await crmService.logCommunication({
        leadId,
        type: formData.type as any,
        direction: formData.direction as any,
        subject: formData.subject,
        content: formData.content,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      });
      toast.success('Communication logged successfully');
      onSuccess();
      onOpenChange(false);
      setFormData({
        type: 'CALL',
        direction: 'OUTBOUND',
        subject: '',
        content: '',
        duration: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to log communication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Communication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CALL">Phone Call</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => setFormData({ ...formData, direction: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTBOUND">Outbound (Sent)</SelectItem>
                  <SelectItem value="INBOUND">Inbound (Received)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject / Summary</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Initial consultation call"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Details</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Add details about the communication..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Communication'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
