'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { GuideDataDialog } from '@/components/travel-guide/guide-data-dialog';
import { GuideDataFilter } from '@/components/travel-guide/guide-data-filter';
import { GuideDataTable } from '@/components/travel-guide/guide-data-table';
import { Pagination } from '@/components/travel-guide/pagination';
import { Button } from '@/components/ui/button';
import { travelGuideService } from '@/services/travel-guide.service';
import {
  GuideDataFilters,
  TravelGuideCity,
  TravelGuideData,
  TravelGuideState,
} from '@/types/travel-guide.types';
import { Loader2, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GuideDataPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [guideData, setGuideData] = useState<TravelGuideData[]>([]);
  const [states, setStates] = useState<TravelGuideState[]>([]);
  const [cities, setCities] = useState<TravelGuideCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [stateId, setStateId] = useState(searchParams.get('stateId') || 'all');
  const [cityId, setCityId] = useState(searchParams.get('cityId') || 'all');
  const [isActive, setIsActive] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGuideData, setSelectedGuideData] = useState<TravelGuideData | null>(null);

  const limit = 10;

  // Fetch states on mount
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

  useEffect(() => {
    const fetchCities = async () => {
      if (stateId === 'all') {
        setCities([]);
        return;
      }

      setIsLoadingCities(true);
      try {
        const response = await travelGuideService.getAllCities({
          stateId,
          limit: 100,
        });
        setCities(response.cities);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [stateId]);

  useEffect(() => {
    setCityId(cityId);
  }, [stateId]);

  const fetchGuideData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [sortField, sortOrder] = sortBy.split('-');
      const filters: GuideDataFilters = {
        page: currentPage,
        limit,
        stateId: stateId !== 'all' ? stateId : undefined,
        cityId: cityId !== 'all' ? cityId : undefined,
        isActive: isActive === 'all' ? undefined : isActive === 'true',
        sortBy: sortField,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const response = await travelGuideService.getAllGuideData(filters);
      setGuideData(response.guideData);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch guide data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingStates) {
      fetchGuideData();
    }
  }, [currentPage, search, stateId, cityId, isActive, sortBy, isLoadingStates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stateId, cityId, isActive, sortBy]);

  const handleReset = () => {
    setSearch('');
    setStateId('all');
    setCityId('all');
    setIsActive('all');
    setSortBy('createdAt-desc');
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setGuideData(guideData.filter((data) => data.id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleEdit = (data: TravelGuideData) => {
    setSelectedGuideData(data);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedGuideData(null);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchGuideData();
  };

  return (
    <ProtectedRoute requiredModule="Travel-Guide" requiredAction="view">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Travel Guide - Content
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage travel guide content for cities ({total} total)
              </p>
            </div>
            <Button onClick={handleCreate} className="w-fit cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Create Guide Content
            </Button>
          </div>

          <GuideDataFilter
            search={search}
            stateId={stateId}
            cityId={cityId}
            isActive={isActive}
            sortBy={sortBy}
            states={states}
            cities={cities}
            onSearchChange={setSearch}
            onStateChange={setStateId}
            onCityChange={setCityId}
            onActiveChange={setIsActive}
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
            <Button variant="outline" onClick={fetchGuideData} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <GuideDataTable
              guideData={guideData}
              onDelete={handleDelete}
              onUpdate={fetchGuideData}
              onEdit={handleEdit}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)}{' '}
                  of {total} results
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

        <GuideDataDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          guideData={selectedGuideData}
          states={states}
          cities={cities}
          onSuccess={handleDialogSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}
