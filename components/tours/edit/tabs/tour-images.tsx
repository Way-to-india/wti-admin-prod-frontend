'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface TourImagesProps {
  tourId: string;
  images: string[];
  onImagesChange: (images: string[], newFiles: File[]) => void;
}

export function TourImages({ images, onImagesChange }: TourImagesProps) {
  const [existingImages, setExistingImages] = useState<string[]>(images);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  useEffect(() => {
    setExistingImages(images);
  }, [images]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const previews: string[] = [];

    fileArray.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB size limit`);
        return;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...newImageFiles, ...validFiles];
      const updatedPreviews = [...newImagePreviews, ...previews];

      setNewImageFiles(updatedFiles);
      setNewImagePreviews(updatedPreviews);

      // Notify parent with current existing images and new files
      onImagesChange(existingImages, updatedFiles);

      toast.success(`${validFiles.length} image(s) added`);
    }

    e.target.value = '';
  };

  const removeExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);

    // IMPORTANT: Notify parent with UPDATED existing images array
    onImagesChange(updatedImages, newImageFiles);

    console.log('🗑️ Removed existing image at index:', index);
    console.log('📊 Updated existing images:', updatedImages);

    toast.info('Image removed (will be deleted on save)');
  };

  const removeNewImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newImagePreviews[index]);

    const updatedFiles = newImageFiles.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);

    setNewImageFiles(updatedFiles);
    setNewImagePreviews(updatedPreviews);

    // Notify parent with current existing images and updated new files
    onImagesChange(existingImages, updatedFiles);

    console.log('🗑️ Removed new image at index:', index);
    console.log('📊 Updated new files count:', updatedFiles.length);

    toast.info('New image removed');
  };

  const totalImages = existingImages.length + newImagePreviews.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tour Images</CardTitle>
            <CardDescription>Upload and manage tour images ({totalImages} total)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="file-upload">Upload New Images</Label>
          <div className="mt-2">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {totalImages === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-muted-foreground">No images added yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {existingImages.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium">
                  Current Images ({existingImages.length})
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {existingImages.map((img, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <Image src={img} alt={`Existing ${idx + 1}`} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute right-2 top-2"
                          onClick={() => removeExistingImage(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {idx === 0 && (
                        <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newImagePreviews.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-orange-600 dark:text-orange-400">
                  New Images - Not Saved Yet ({newImagePreviews.length})
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {newImagePreviews.map((preview, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border-2 border-orange-300 dark:border-orange-700"
                    >
                      <Image src={preview} alt={`New ${idx + 1}`} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute right-2 top-2"
                          onClick={() => removeNewImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute left-2 top-2 rounded bg-orange-600 px-2 py-1 text-xs text-white">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {newImagePreviews.length > 0 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              💡 New images will be uploaded when you click Save Changes button
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
