import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  imageUrl?: string;
  image?: File;
}

interface ItineraryTabProps {
  itinerary: ItineraryDay[];
  setItinerary: (itinerary: ItineraryDay[]) => void;
}

export function ItineraryTab({ itinerary, setItinerary }: ItineraryTabProps) {
  const [imagePreview, setImagePreview] = useState<{ [key: number]: string }>({});

  const addDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '', imageUrl: '' },
    ]);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | number | File) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    const renumbered = updated.map((item, i) => ({ ...item, day: i + 1 }));

    // Remove preview for this index
    const newPreviews = { ...imagePreview };
    delete newPreviews[index];

    // Renumber preview keys
    const renumberedPreviews: { [key: number]: string } = {};
    Object.entries(newPreviews).forEach(([key, value]) => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        renumberedPreviews[oldIndex - 1] = value;
      } else {
        renumberedPreviews[oldIndex] = value;
      }
    });

    setImagePreview(renumberedPreviews);
    setItinerary(renumbered);
  };

  const handleImageChange = (index: number, file: File | null) => {
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
        setImagePreview((prev) => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);

      updateDay(index, 'image', file);
    } else {
      // Remove image
      setImagePreview((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
      updateDay(index, 'image', undefined as any);
      updateDay(index, 'imageUrl', '');
    }
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    updateDay(index, 'image', undefined as any);
    updateDay(index, 'imageUrl', '');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Day-by-Day Itinerary</CardTitle>
            <CardDescription>Plan the tour schedule for each day</CardDescription>
          </div>
          <Button type="button" onClick={addDay} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {itinerary.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
            <p className="mb-4 text-muted-foreground">No itinerary days added yet</p>
            <Button type="button" onClick={addDay} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Day
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {itinerary.map((day, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {day.day}
                      </div>
                      <div>
                        <CardTitle className="text-lg">Day {day.day}</CardTitle>
                        <p className="text-sm text-muted-foreground">{day.title || 'Untitled'}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(index)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={day.title}
                      onChange={(e) => updateDay(index, 'title', e.target.value)}
                      placeholder="e.g., Arrival and City Tour"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <RichTextEditor
                      content={day.description}
                      onChange={(content) => updateDay(index, 'description', content)}
                      placeholder="Describe the activities for this day..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Day Image (Optional)</Label>

                    {imagePreview[index] || day.imageUrl ? (
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview[index] || day.imageUrl || ''}
                          alt={`Day ${day.day} preview`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageChange(index, file);
                          }}
                          className="hidden"
                          id={`itinerary-image-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById(`itinerary-image-${index}`)?.click()
                          }
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200x675px (16:9 ratio), Max 10MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
