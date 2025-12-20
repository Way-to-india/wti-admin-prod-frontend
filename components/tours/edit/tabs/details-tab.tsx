import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicListInput } from '@/components/ui/dynamic-list-input';
import { UpdateTourData } from '@/types/tour.types';

interface TabProps {
  formData: UpdateTourData;
  updateField: (field: keyof UpdateTourData, value: any) => void;
}

export function DetailsTab({ formData, updateField }: TabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tour Highlights</CardTitle>
          <CardDescription>Key attractions and experiences</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicListInput
            items={formData.highlights || []}
            onChange={(items) => updateField('highlights', items)}
            placeholder="e.g., Visit to Taj Mahal"
            label="Highlight"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inclusions</CardTitle>
          <CardDescription>What&apos;s included in the tour package</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicListInput
            items={formData.inclusions || []}
            onChange={(items) => updateField('inclusions', items)}
            placeholder="e.g., Hotel accommodation"
            label="Inclusion"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exclusions</CardTitle>
          <CardDescription>What&apos;s not included in the tour package</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicListInput
            items={formData.exclusions || []}
            onChange={(items) => updateField('exclusions', items)}
            placeholder="e.g., Personal expenses"
            label="Exclusion"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function PricingTab({ formData, updateField }: TabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Information</CardTitle>
        <CardDescription>Set tour prices and group size limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Discount Price</Label>
            <Input
              id="discountPrice"
              type="number"
              min="0"
              value={formData.discountPrice}
              onChange={(e) => updateField('discountPrice', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => updateField('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minGroupSize">Minimum Group Size</Label>
            <Input
              id="minGroupSize"
              type="number"
              min="1"
              value={formData.minGroupSize}
              onChange={(e) => updateField('minGroupSize', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxGroupSize">Maximum Group Size</Label>
            <Input
              id="maxGroupSize"
              type="number"
              min="1"
              value={formData.maxGroupSize}
              onChange={(e) => updateField('maxGroupSize', parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
