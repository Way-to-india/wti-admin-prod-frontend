import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Plus, Trash2 } from 'lucide-react';
import { ItineraryDay } from '@/types/tour.types';


interface ItineraryTabProps {
  itinerary: ItineraryDay[];
  setItinerary: (itinerary: ItineraryDay[]) => void;
}

export function ItineraryTab({ itinerary, setItinerary }: ItineraryTabProps) {
  const addDay = () => {
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: '', description: '', imageUrl: '' },
    ]);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    const renumbered = updated.map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(renumbered);
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
                    <Label>Image URL (Optional)</Label>
                    <Input
                      value={day.imageUrl || ''}
                      onChange={(e) => updateDay(index, 'imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
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
