import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/crm-utils';
import { Lead } from '@/types/crm.types';
import { Calendar, DollarSign, Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

interface LeadOverviewProps {
  lead: Lead;
}

export function LeadOverview({ lead }: LeadOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="text-sm">{lead.email}</p>
            </div>
          </div>
          {lead.phoneNumber && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p className="text-sm">{lead.phoneNumber}</p>
              </div>
            </div>
          )}
          {lead.alternatePhone && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alternate Phone</p>
                <p className="text-sm">{lead.alternatePhone}</p>
              </div>
            </div>
          )}
          {lead.city && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="text-sm">{lead.city}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Travel Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Travel Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lead.destination && (
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Destination</p>
                <p className="text-sm font-semibold">{lead.destination}</p>
              </div>
            </div>
          )}
          {(lead.travelStartDate || lead.travelEndDate) && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Travel Dates</p>
                <p className="text-sm">
                  {lead.travelStartDate &&
                    new Date(lead.travelStartDate).toLocaleDateString('en-IN')}
                  {lead.travelStartDate && lead.travelEndDate && ' - '}
                  {lead.travelEndDate && new Date(lead.travelEndDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          )}
          {lead.numberOfTravelers && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Travelers</p>
                <p className="text-sm">
                  {lead.numberOfTravelers} total
                  {lead.numberOfAdults && ` (${lead.numberOfAdults} adults`}
                  {lead.numberOfChildren && `, ${lead.numberOfChildren} children)`}
                  {lead.numberOfAdults && !lead.numberOfChildren && ')'}
                </p>
              </div>
            </div>
          )}
          {(lead.budgetMin || lead.budgetMax) && (
            <div className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Special Requests */}
      {lead.specialRequests && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {lead.specialRequests}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
