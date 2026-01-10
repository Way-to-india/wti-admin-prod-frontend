import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lead } from '@/types/crm.types';
import { ArrowLeft, Edit, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LeadStatusBadge } from './lead-status-badge';

interface LeadDetailHeaderProps {
  lead: Lead;
  onStatusUpdate: (status: string) => void;
  onAssignClick: () => void;
  onEditClick?: () => void;
}

export function LeadDetailHeader({
  lead,
  onStatusUpdate,
  onAssignClick,
  onEditClick,
}: LeadDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{lead.fullName}</h1>
            <LeadStatusBadge priority={lead.priority} />
            <LeadStatusBadge status={lead.status} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground font-mono text-sm bg-muted px-2 py-0.5 rounded">
              {lead.referenceNumber}
            </p>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Created on{' '}
              {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {onEditClick && (
          <Button variant="outline" onClick={onEditClick}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
        <Button variant="outline" onClick={onAssignClick}>
          <UserPlus className="w-4 h-4 mr-2" />
          Assign
        </Button>
        <Select value={lead.status} onValueChange={onStatusUpdate}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="INTERESTED">Interested</SelectItem>
            <SelectItem value="QUOTED">Quoted</SelectItem>
            <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
            <SelectItem value="FOLLOW_UP_SCHEDULED">Follow-up</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CLOSED_WON">Won</SelectItem>
            <SelectItem value="CLOSED_LOST">Lost</SelectItem>
            <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
