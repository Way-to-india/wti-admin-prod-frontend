'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { DraftsTable } from '@/components/drafts/drafts-table';
import { Button } from '@/components/ui/button';
import { tourDraftService } from '@/services/tour-draft.service';
import { TourDraft } from '@/types/tour-draft.types';
import { FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<TourDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const fetchDrafts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await tourDraftService.getAllDrafts({
        page: 1,
        limit: 100,
        sortOrder: 'desc',
      });
      setDrafts(response.drafts);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch drafts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
    setTotal((prev) => prev - 1);
  };

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="view">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Tour Drafts</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage saved tour drafts ({total} total)
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchDrafts} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <DraftsTable drafts={drafts} onDelete={handleDelete} onUpdate={fetchDrafts} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
