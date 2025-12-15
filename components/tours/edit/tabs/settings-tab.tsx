import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UpdateTourData } from '@/services/tour.service';


interface TabProps {
  formData: UpdateTourData;
  updateField: (field: keyof UpdateTourData, value: any) => void;
}

export function SettingsTab({ formData, updateField }: TabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Settings</CardTitle>
        <CardDescription>Additional tour configurations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bestTime">Best Time to Visit</Label>
            <Input
              id="bestTime"
              value={formData.bestTime}
              onChange={(e) => updateField('bestTime', e.target.value)}
              placeholder="e.g., October to March"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idealFor">Ideal For</Label>
            <Input
              id="idealFor"
              value={formData.idealFor}
              onChange={(e) => updateField('idealFor', e.target.value)}
              placeholder="e.g., Families, Couples"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty || ''}
              onValueChange={(value) => updateField('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Challenging">Challenging</SelectItem>
                <SelectItem value="Difficult">Difficult</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">Make this tour visible to users</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField('isActive', checked)}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-base">Featured</Label>
              <p className="text-sm text-muted-foreground">Show this tour in featured section</p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => updateField('isFeatured', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
