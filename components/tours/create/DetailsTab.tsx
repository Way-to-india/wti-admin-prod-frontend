import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Plus, Trash2 } from 'lucide-react';

interface DetailsTabProps {
  bestTime: string;
  setBestTime: (value: string) => void;
  idealFor: string;
  setIdealFor: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  inclusions: string[];
  setInclusions: (value: string[]) => void;
  exclusions: string[];
  setExclusions: (value: string[]) => void;
  travelTips: string;
  setTravelTips: (value: string) => void;
  cancellationPolicy: string;
  setCancellationPolicy: (value: string) => void;
}

export function DetailsTab({
  bestTime,
  setBestTime,
  idealFor,
  setIdealFor,
  difficulty,
  setDifficulty,
  inclusions,
  setInclusions,
  exclusions,
  setExclusions,
  travelTips,
  setTravelTips,
  cancellationPolicy,
  setCancellationPolicy,
}: DetailsTabProps) {
  const addInclusion = () => setInclusions([...inclusions, '']);
  const updateInclusion = (index: number, value: string) => {
    const updated = [...inclusions];
    updated[index] = value;
    setInclusions(updated);
  };
  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const addExclusion = () => setExclusions([...exclusions, '']);
  const updateExclusion = (index: number, value: string) => {
    const updated = [...exclusions];
    updated[index] = value;
    setExclusions(updated);
  };
  const removeExclusion = (index: number) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Tour Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Information</CardTitle>
          <CardDescription>Additional details about the tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="bestTime">Best Time to Visit</Label>
              <Input
                id="bestTime"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                placeholder="e.g., Oct-Mar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idealFor">Ideal For</Label>
              <Input
                id="idealFor"
                value={idealFor}
                onChange={(e) => setIdealFor(e.target.value)}
                placeholder="e.g., Families, Couples"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Input
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="e.g., Easy, Moderate, Hard"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inclusions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-600">What's Included</CardTitle>
              <CardDescription>Items and services included in the tour</CardDescription>
            </div>
            <Button type="button" onClick={addInclusion} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Inclusion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inclusions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <p className="mb-4 text-muted-foreground">No inclusions added yet</p>
              <Button type="button" onClick={addInclusion} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Inclusion
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={inclusion}
                    onChange={(e) => updateInclusion(index, e.target.value)}
                    placeholder="e.g., Hotel accommodation"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInclusion(index)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exclusions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-red-600">What's Not Included</CardTitle>
              <CardDescription>Items and services not included in the tour</CardDescription>
            </div>
            <Button type="button" onClick={addExclusion} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Exclusion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {exclusions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <p className="mb-4 text-muted-foreground">No exclusions added yet</p>
              <Button type="button" onClick={addExclusion} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Exclusion
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={exclusion}
                    onChange={(e) => updateExclusion(index, e.target.value)}
                    placeholder="e.g., Airfare"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExclusion(index)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Tips</CardTitle>
          <CardDescription>Helpful tips for travelers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Travel Tips</Label>
            <RichTextEditor
              content={travelTips}
              onChange={setTravelTips}
              placeholder="Add helpful travel tips, what to pack, local customs, etc..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Cancellation Policy</CardTitle>
          <CardDescription>Terms and conditions for cancellation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Cancellation Policy</Label>
            <RichTextEditor
              content={cancellationPolicy}
              onChange={setCancellationPolicy}
              placeholder="Enter cancellation policy details..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
