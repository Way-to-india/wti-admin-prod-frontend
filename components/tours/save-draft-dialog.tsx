import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SaveDraftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isSaving: boolean;
  defaultName?: string;
  tourTitle?: string;
}

export function SaveDraftDialog({
  isOpen,
  onClose,
  onSave,
  isSaving,
  defaultName = '',
  tourTitle = '',
}: SaveDraftDialogProps) {
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState('');

  // Reset name when dialog opens or defaultName changes
  useEffect(() => {
    if (isOpen) {
      setName(defaultName || tourTitle || '');
      setError('');
    }
  }, [isOpen, defaultName, tourTitle]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Draft name is required');
      return;
    }

    if (name.trim().length < 3) {
      setError('Draft name must be at least 3 characters');
      return;
    }

    onSave(name.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save as Draft</DialogTitle>
          <DialogDescription>Give your draft a name to easily find it later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="draft-name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input
                id="draft-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                disabled={isSaving}
                placeholder="e.g. Summer Rajasthan Tour"
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Draft'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
