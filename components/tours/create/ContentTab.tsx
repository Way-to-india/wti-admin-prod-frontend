import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Plus, Trash2 } from 'lucide-react';

interface ContentTabProps {
  overview: string;
  setOverview: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  highlights: string[];
  setHighlights: (value: string[]) => void;
}

export function ContentTab({
  overview,
  setOverview,
  description,
  setDescription,
  highlights,
  setHighlights,
}: ContentTabProps) {
  const addHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Overview</CardTitle>
          <CardDescription>Provide a brief, engaging overview of the tour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>
              Overview <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor
              content={overview}
              onChange={setOverview}
              placeholder="Write an engaging overview that captures the essence of this tour..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Description</CardTitle>
          <CardDescription>Provide comprehensive details about the tour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Describe the tour in detail, including what makes it special, what travelers can expect..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tour Highlights</CardTitle>
              <CardDescription>Add key highlights and attractions of this tour</CardDescription>
            </div>
            <Button type="button" onClick={addHighlight} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Highlight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {highlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <p className="mb-4 text-muted-foreground">No highlights added yet</p>
              <Button type="button" onClick={addHighlight} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Highlight
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder={`Highlight ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
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
    </div>
  );
}
