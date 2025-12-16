import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Image as ImageIcon, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ImagesTabProps {
  images: File[];
  setImages: (value: File[]) => void;
  coverImage: File | null;
  setCoverImage: (value: File | null) => void;
}

export function ImagesTab({ images, setImages, coverImage, setCoverImage }: ImagesTabProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverImageChange = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setCoverImage(file);
    } else {
      setCoverPreview(null);
      setCoverImage(null);
    }
  };

  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Cover Image
          </CardTitle>
          <CardDescription>
            Upload a stunning cover image for your tour (This will be the main image)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coverPreview ? (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('cover-image-input') as HTMLInputElement;
                    input?.click();
                  }}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Change Cover Image
                </Button>
                <Button type="button" variant="destructive" onClick={removeCoverImage}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverImageChange(file);
                }}
                className="hidden"
                id="cover-image-input"
              />
              <button
                type="button"
                onClick={() => document.getElementById('cover-image-input')?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">Upload Cover Image</p>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: 1920x1080px (16:9 ratio), Max 10MB
                </p>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tour Gallery</CardTitle>
              <CardDescription>Upload multiple images to showcase your tour</CardDescription>
            </div>
            <Button
              type="button"
              onClick={() => document.getElementById('gallery-images-input')?.click()}
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Images
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImagesChange(e.target.files)}
            className="hidden"
            id="gallery-images-input"
          />

          {imagePreviews.length === 0 ? (
            <button
              type="button"
              onClick={() => document.getElementById('gallery-images-input')?.click()}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 transition-colors"
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">Upload Gallery Images</p>
              <p className="mt-1 text-xs text-gray-500">
                Click to select multiple images (Max 20 images, 10MB each)
              </p>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <Image
                        src={preview}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('gallery-images-input')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add More Images ({imagePreviews.length}/20)
              </Button>
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            💡 Tip: Upload high-quality images that showcase the tour&apos;s highlights and
            destinations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
