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
import { UpdateTourData } from '@/types/tour.types';

interface TabProps {
  formData: UpdateTourData;
  updateField: (field: keyof UpdateTourData, value: any) => void;
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
