'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { CreateLeadData } from '@/types/crm.types';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateLeadData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    source: 'WEBSITE_FORM',
    priority: 'WARM',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const lead = await crmService.createLead(formData);
      toast.success('Lead created successfully!');
      router.push(`/dashboard/crm/leads/${lead.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CreateLeadData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl p-6 mx-auto min-w-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Lead</h1>
          <p className="text-gray-600 mt-1">Add a new lead to the CRM system</p>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone || ''}
                    onChange={(e) => updateField('alternatePhone', e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Mumbai"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">
                    Source <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => updateField('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEBSITE_FORM">Website Form</SelectItem>
                      <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="FACEBOOK">Facebook</SelectItem>
                      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                      <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                      <SelectItem value="REFERRAL">Referral</SelectItem>
                      <SelectItem value="WALK_IN">Walk-in</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination || ''}
                    onChange={(e) => updateField('destination', e.target.value)}
                    placeholder="Goa, Kerala, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType || ''}
                    onValueChange={(value) => updateField('serviceType', value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOUR">Tour Package</SelectItem>
                      <SelectItem value="HOTEL">Hotel Only</SelectItem>
                      <SelectItem value="TRANSPORT">Transport Only</SelectItem>
                      <SelectItem value="MIXED">Mixed Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelStartDate">Travel Start Date</Label>
                  <Input
                    id="travelStartDate"
                    type="date"
                    value={formData.travelStartDate?.split('T')[0] || ''}
                    onChange={(e) =>
                      updateField(
                        'travelStartDate',
                        e.target.value ? new Date(e.target.value).toISOString() : null
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelEndDate">Travel End Date</Label>
                  <Input
                    id="travelEndDate"
                    type="date"
                    value={formData.travelEndDate?.split('T')[0] || ''}
                    onChange={(e) =>
                      updateField(
                        'travelEndDate',
                        e.target.value ? new Date(e.target.value).toISOString() : null
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfTravelers">Number of Travelers</Label>
                  <Input
                    id="numberOfTravelers"
                    type="number"
                    min="1"
                    value={formData.numberOfTravelers || ''}
                    onChange={(e) =>
                      updateField(
                        'numberOfTravelers',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfAdults">Adults</Label>
                  <Input
                    id="numberOfAdults"
                    type="number"
                    min="0"
                    value={formData.numberOfAdults || ''}
                    onChange={(e) =>
                      updateField(
                        'numberOfAdults',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfChildren">Children</Label>
                  <Input
                    id="numberOfChildren"
                    type="number"
                    min="0"
                    value={formData.numberOfChildren || ''}
                    onChange={(e) =>
                      updateField(
                        'numberOfChildren',
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Budget Min (₹)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    min="0"
                    value={formData.budgetMin || ''}
                    onChange={(e) =>
                      updateField('budgetMin', e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Budget Max (₹)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    min="0"
                    value={formData.budgetMax || ''}
                    onChange={(e) =>
                      updateField('budgetMax', e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="75000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests || ''}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    placeholder="Any special requirements or preferences..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => updateField('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOT">🔥 Hot</SelectItem>
                      <SelectItem value="WARM">🟠 Warm</SelectItem>
                      <SelectItem value="COLD">🔵 Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select
                    value={formData.quality || ''}
                    onValueChange={(value: any) => updateField('quality', value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - High Quality</SelectItem>
                      <SelectItem value="B">B - Medium Quality</SelectItem>
                      <SelectItem value="C">C - Low Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
