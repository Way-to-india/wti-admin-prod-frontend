import { Badge } from '@/components/ui/badge';
import { getPriorityColor, getStatusColor } from '@/lib/crm-utils';
import { cn } from '@/lib/utils';
import { LeadPriority, LeadStatus } from '@/types/crm.types';

interface LeadStatusBadgeProps {
  status?: LeadStatus | string;
  priority?: LeadPriority | string;
  className?: string;
}

export function LeadStatusBadge({ status, priority, className }: LeadStatusBadgeProps) {
  if (priority) {
    return (
      <Badge variant="outline" className={cn('font-medium', getPriorityColor(priority), className)}>
        {priority}
      </Badge>
    );
  }

  if (status) {
    return (
      <Badge variant="outline" className={cn('font-medium', getStatusColor(status), className)}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  }

  return null;
}
