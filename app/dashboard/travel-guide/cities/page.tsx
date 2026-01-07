'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { CitiesFilter } from '@/components/travel-guide/cities-filter';
import { CitiesTable } from '@/components/travel-guide/cities-table';
import { CityDialog } from '@/components/travel-guide/city-dialog';
import { Pagination } from '@/components/travel-guide/pagination';
import { Button } from '@/components/ui/button';
import { travelGuideService } from '@/services/travel-guide.service';
import { CityFilters, TravelGuideCity, TravelGuideState } from '@/types/travel-guide.types';
import { Loader2, Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function CitiesContent() {
  const searchParams = useSearchParams();

  const [cities, setCities] = useState<TravelGuideCity[]>([]);
  const [states, setStates] = useState<TravelGuideState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [stateId, setStateId] = useState(searchParams.get('stateId') || 'all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<TravelGuideCity | null>(null);

  const limit = 10;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await travelGuideService.getAllStates({ limit: 100 });
        setStates(response.states);
      } catch (err) {
        console.error('Failed to fetch states:', err);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [sortField, sortOrder] = sortBy.split('-');
      const filters: CityFilters = {
        page: currentPage,
        limit,
        search: search || undefined,
        stateId: stateId !== 'all' ? stateId : undefined,
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const response = await travelGuideService.getAllCities(filters);
      setCities(response.cities);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch cities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingStates) {
      fetchCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, stateId, sortBy, isLoadingStates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stateId, sortBy]);

  const handleReset = () => {
    setSearch('');
    setStateId('all');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setCities(cities.filter((city) => city.id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleEdit = (city: TravelGuideCity) => {
    setSelectedCity(city);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCity(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchCities();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Travel Guide - Cities</h1>
            <p className="text-sm text-muted-foreground">
              Manage cities for the travel guide ({total} total)
            </p>
          </div>
          <Button onClick={handleCreate} className="w-fit cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create City
          </Button>
        </div>

        <CitiesFilter
          search={search}
          stateId={stateId}
          sortBy={sortBy}
          states={states}
          onSearchChange={setSearch}
          onStateChange={setStateId}
          onSortChange={setSortBy}
          onReset={handleReset}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={fetchCities} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <CitiesTable cities={cities} onDelete={handleDelete} onEdit={handleEdit} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of{' '}
                {total} results
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      <CityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        city={selectedCity}
        states={states}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}

export default function CitiesPage() {
  return (
    <ProtectedRoute requiredModule="Travel-Guide" requiredAction="view">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <CitiesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
