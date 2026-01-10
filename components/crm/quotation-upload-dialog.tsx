'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { crmService } from '@/services/crm.service';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuotationUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess: () => void;
}

export function QuotationUploadDialog({
  open,
  onOpenChange,
  leadId,
  onSuccess,
}: QuotationUploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setLoading(true);

      // In a real app, we would upload to S3 here first
      // For now, we'll simulate the upload and just save metadata
      // The user can implement actual S3 upload later

      const mockFileUrl = `https://example.com/quotations/${file.name}`;

      await crmService.uploadQuotation({
        leadId,
        fileName: file.name,
        fileKey: `quotations/${leadId}/${file.name}`,
        fileUrl: mockFileUrl,
        fileSize: file.size,
        fileType: file.type,
        amount: amount ? parseInt(amount) : undefined,
        description,
      });

      toast.success('Quotation uploaded successfully');
      onSuccess();
      onOpenChange(false);
      setFile(null);
      setAmount('');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Quotation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Quotation File (PDF)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="cursor-pointer"
              />
            </div>
            {file && (
              <p className="text-xs text-gray-500">
                {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Quotation Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Notes</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Version 1 with hotel upgrade"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Upload className="w-4 h-4 mr-2" />
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
