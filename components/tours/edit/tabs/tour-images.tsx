'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface TourImagesProps {
  tourId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function TourImages({ tourId, images, onImagesChange }: TourImagesProps) {
  const [localImages, setLocalImages] = useState<string[]>(images);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const removeImage = (index: number) => {
    setLocalImages(localImages.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: Replace with actual upload API
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('tourId', tourId);

        // Simulated API call
        const fakeUrl = URL.createObjectURL(files[i]);
        uploadedUrls.push(fakeUrl);
      }

      setLocalImages([...localImages, ...uploadedUrls]);
      setHasChanges(true);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const saveChanges = async () => {
    setIsUploading(true);
    try {
      // TODO: Replace with actual API call
      // await apiClient.put(`/admin/tours/${tourId}/images`, { images: localImages });

      onImagesChange(localImages);
      setHasChanges(false);
      toast.success('Images saved successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save images');
    } finally {
      setIsUploading(false);
    }
  };

  const discardChanges = () => {
    setLocalImages(images);
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tour Images</CardTitle>
            <CardDescription>Upload and manage tour images</CardDescription>
          </div>
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={discardChanges} disabled={isUploading}>
                Discard
              </Button>
              <Button onClick={saveChanges} disabled={isUploading}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div>
          <Label htmlFor="file-upload">Upload Files</Label>
          <div className="mt-2">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-gray-700"
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Images Grid */}
        {localImages.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-muted-foreground">No images added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {localImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-lg border"
              >
                <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => removeImage(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
