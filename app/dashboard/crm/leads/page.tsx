'use client';

import { LeadFiltersComponent } from '@/components/crm/lead-filters';
import { LeadTable } from '@/components/crm/lead-table';
import { Button } from '@/components/ui/button';
import { crmService } from '@/services/crm.service';
import { Lead, LeadFilters } from '@/types/crm.types';
import { Download, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: (searchParams.get('status') as any) || undefined,
    priority: (searchParams.get('priority') as any) || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await crmService.getAllLeads(filters);
      setLeads(response.leads);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your customer inquiries efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => toast.info('Export feature is being prepared.')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/crm/leads/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <LeadFiltersComponent filters={filters} onFilterChange={setFilters} />

      {/* Main Table Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{leads.length}</span> of{' '}
            <span className="font-semibold text-foreground">{pagination.total}</span> leads
          </span>
          <span className="bg-muted px-2 py-1 rounded text-muted-foreground font-mono text-xs">
            Sorted by {filters.sortBy} ({filters.sortOrder})
          </span>
        </div>

        <LeadTable leads={leads} loading={loading} />

        {/* Pagination Section */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page <span className="font-semibold text-foreground">{pagination.page}</span> of{' '}
              <span className="font-semibold text-foreground">{pagination.totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1 || loading}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages || loading}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
