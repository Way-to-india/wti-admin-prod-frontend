import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/crm-utils';
import { cn } from '@/lib/utils';
import { Lead } from '@/types/crm.types';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LeadStatusBadge } from './lead-status-badge';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
}

export function LeadTable({ leads, loading }: LeadTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="p-12 text-center border rounded-lg bg-muted/20">
        <div className="animate-pulse text-muted-foreground">Loading leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg bg-muted/20">
        <p className="text-lg font-semibold">No leads found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[100px] font-semibold">Ref #</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Destination</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="text-right font-semibold">Value</TableHead>
            <TableHead className="text-right font-semibold">Score</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="group cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/dashboard/crm/leads/${lead.id}`)}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                {lead.referenceNumber}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold">{lead.fullName}</span>
                  <span className="text-xs text-muted-foreground">{lead.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{lead.destination || '-'}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell>
                <LeadStatusBadge priority={lead.priority} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(lead.estimatedValue)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-1 rounded text-sm font-bold',
                    lead.leadScore > 70
                      ? 'text-green-700 bg-green-50'
                      : lead.leadScore > 40
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-rose-700 bg-rose-50'
                  )}
                >
                  {lead.leadScore}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/crm/leads/${lead.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
