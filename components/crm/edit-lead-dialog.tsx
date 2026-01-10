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
import { Textarea } from '@/components/ui/textarea';
import { crmService } from '@/services/crm.service';
import { Lead, UpdateLeadData } from '@/types/crm.types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSuccess: () => void;
}

export function EditLeadDialog({ open, onOpenChange, lead, onSuccess }: EditLeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateLeadData>({
    fullName: lead.fullName,
    email: lead.email,
    phoneNumber: lead.phoneNumber || '',
    alternatePhone: lead.alternatePhone || '',
    city: lead.city || '',
    destination: lead.destination || '',
    numberOfTravelers: lead.numberOfTravelers || undefined,
    numberOfAdults: lead.numberOfAdults || undefined,
    numberOfChildren: lead.numberOfChildren || undefined,
    budgetMin: lead.budgetMin || undefined,
    budgetMax: lead.budgetMax || undefined,
    specialRequests: lead.specialRequests || '',
    estimatedValue: lead.estimatedValue || undefined,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        fullName: lead.fullName,
        email: lead.email,
        phoneNumber: lead.phoneNumber || '',
        alternatePhone: lead.alternatePhone || '',
        city: lead.city || '',
        destination: lead.destination || '',
        numberOfTravelers: lead.numberOfTravelers || undefined,
        numberOfAdults: lead.numberOfAdults || undefined,
        numberOfChildren: lead.numberOfChildren || undefined,
        budgetMin: lead.budgetMin || undefined,
        budgetMax: lead.budgetMax || undefined,
        specialRequests: lead.specialRequests || '',
        estimatedValue: lead.estimatedValue || undefined,
      });
    }
  }, [open, lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      await crmService.updateLead(lead.id, formData);
      toast.success('Lead updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead - {lead.referenceNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfTravelers">Travelers</Label>
              <Input
                id="numberOfTravelers"
                type="number"
                value={formData.numberOfTravelers || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfTravelers: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfAdults">Adults</Label>
              <Input
                id="numberOfAdults"
                type="number"
                value={formData.numberOfAdults || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfAdults: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfChildren">Children</Label>
              <Input
                id="numberOfChildren"
                type="number"
                value={formData.numberOfChildren || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfChildren: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Budget Min (₹)</Label>
              <Input
                id="budgetMin"
                type="number"
                value={formData.budgetMin || ''}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: parseInt(e.target.value) || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Budget Max (₹)</Label>
              <Input
                id="budgetMax"
                type="number"
                value={formData.budgetMax || ''}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: parseInt(e.target.value) || undefined })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
              <Input
                id="estimatedValue"
                type="number"
                value={formData.estimatedValue || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedValue: parseInt(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
