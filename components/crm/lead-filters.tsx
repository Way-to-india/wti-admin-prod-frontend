import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { LeadFilters } from '@/types/crm.types';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeadFilterProps {
  filters: LeadFilters;
  onFilterChange: (filters: LeadFilters) => void;
}

export function LeadFiltersComponent({ filters, onFilterChange }: LeadFilterProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, phone..."
              className="pl-10 h-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-6 lg:col-span-2">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                status: value === 'all' ? undefined : (value as any),
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="INTERESTED">Interested</SelectItem>
              <SelectItem value="QUOTED">Quoted</SelectItem>
              <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CLOSED_WON">Won</SelectItem>
              <SelectItem value="CLOSED_LOST">Lost</SelectItem>
              <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-6 lg:col-span-2">
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                priority: value === 'all' ? undefined : (value as any),
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="HOT">🔥 Hot</SelectItem>
              <SelectItem value="WARM">🌡️ Warm</SelectItem>
              <SelectItem value="COLD">❄️ Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality Filter (NEW) */}
        <div className="md:col-span-6 lg:col-span-2">
          <Select
            value={filters.quality || 'all'}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                quality: value === 'all' ? undefined : (value as any),
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quality</SelectItem>
              <SelectItem value="A">A - Premium</SelectItem>
              <SelectItem value="B">B - Standard</SelectItem>
              <SelectItem value="C">C - Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="md:col-span-6 lg:col-span-2">
          <Select
            value={filters.sortBy || 'createdAt'}
            onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="leadScore">Lead Score</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="estimatedValue">Value</SelectItem>
              <SelectItem value="nextFollowUpAt">Next Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
