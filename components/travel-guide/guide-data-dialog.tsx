'use client';

import { GuideDataForm } from '@/components/travel-guide/guide-data-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TravelGuideCity, TravelGuideData, TravelGuideState } from '@/types/travel-guide.types';

interface GuideDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guideData: TravelGuideData | null;
  states: TravelGuideState[];
  cities: TravelGuideCity[];
  onSuccess: () => void;
}

export function GuideDataDialog({
  open,
  onOpenChange,
  guideData,
  onSuccess,
}: GuideDataDialogProps) {
  // The GuideDataForm component handles its own submission and navigation
  // We just need to refresh the list after closing the dialog
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Dialog is closing - refresh the data
      onSuccess();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guideData ? 'Edit Guide Content' : 'Create Guide Content'}</DialogTitle>
        </DialogHeader>
        <GuideDataForm guideData={guideData} mode={guideData ? 'edit' : 'create'} />
      </DialogContent>
    </Dialog>
  );
}
