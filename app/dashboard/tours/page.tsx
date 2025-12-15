'use client';

import { useState, useEffect } from 'react';
import { tourService, Tour, TourFilters } from '@/services/tour.service';
import { ToursTable } from '@/components/tours/tours-table';
import { ToursFilter } from '@/components/tours/tours-filter';
import { ToursPagination } from '@/components/tours/tour-pagination';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';

export default function ToursPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('all');
  const [isFeatured, setIsFeatured] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchTours = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [sortField, sortOrder] = sortBy.split('-');
      const filters: TourFilters = {
        page: currentPage,
        limit,
        search: search || undefined,
        isActive: isActive === 'all' ? undefined : isActive === 'true',
        isFeatured: isFeatured === 'all' ? undefined : isFeatured === 'true',
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
        includeStartCity: true,
        includeThemes: true,
      };

      const response = await tourService.getAllTours(filters);
      setTours(response.tours);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch tours');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [currentPage, search, isActive, isFeatured, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, isActive, isFeatured, sortBy]);

  const handleReset = () => {
    setSearch('');
    setIsActive('all');
    setIsFeatured('all');
    setSortBy('createdAt-desc');
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setTours(tours.filter((tour) => tour.id !== id));
    setTotal((prev) => prev - 1);
  };

  const canCreate = hasPermission('Tours', 'create');

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="view">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Tours</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tour packages ({total} total)
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => router.push('/tours/create')} className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Create Tour
            </Button>
          )}
        </div>

        {/* Filters */}
        <ToursFilter
          search={search}
          isActive={isActive}
          isFeatured={isFeatured}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onActiveChange={setIsActive}
          onFeaturedChange={setIsFeatured}
          onSortChange={setSortBy}
          onReset={handleReset}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchTours} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ToursTable tours={tours} onDelete={handleDelete} onUpdate={fetchTours} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)}{' '}
                  of {total} results
                </p>
                <ToursPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
