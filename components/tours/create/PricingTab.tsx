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
import { IndianRupee, Users } from 'lucide-react';

interface PricingTabProps {
  price: number;
  setPrice: (value: number) => void;
  discountPrice: number;
  setDiscountPrice: (value: number) => void;
  currency: string;
  setCurrency: (value: string) => void;
  minGroupSize: number;
  setMinGroupSize: (value: number) => void;
  maxGroupSize: number;
  setMaxGroupSize: (value: number) => void;
}

export function PricingTab({
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  currency,
  setCurrency,
  minGroupSize,
  setMinGroupSize,
  maxGroupSize,
  setMaxGroupSize,
}: PricingTabProps) {
  const discountPercentage =
    price > 0 && discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Tour Pricing
          </CardTitle>
          <CardDescription>Set the pricing details for your tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">
                Regular Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
              <Input
                id="discountPrice"
                type="number"
                min="0"
                step="100"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              {discountPercentage > 0 && (
                <p className="text-sm text-green-600">{discountPercentage}% discount</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
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

          {/* Price Preview */}
          {price > 0 && (
            <div className="rounded-lg border-2 border-dashed bg-muted p-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Price Preview</p>
              <div className="flex items-baseline gap-3">
                {discountPrice > 0 && discountPrice < price ? (
                  <>
                    <span className="text-3xl font-bold">
                      {currency === 'INR' ? '₹' : currency} {discountPrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {currency === 'INR' ? '₹' : currency} {price.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                      Save {discountPercentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {currency === 'INR' ? '₹' : currency} {price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Size
          </CardTitle>
          <CardDescription>Define the minimum and maximum group size</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minGroupSize">
                Minimum Group Size <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minGroupSize"
                type="number"
                min="1"
                value={minGroupSize}
                onChange={(e) => setMinGroupSize(parseInt(e.target.value) || 1)}
                required
              />
              <p className="text-sm text-muted-foreground">Minimum number of participants</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGroupSize">
                Maximum Group Size <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxGroupSize"
                type="number"
                min="1"
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(parseInt(e.target.value) || 1)}
                required
              />
              <p className="text-sm text-muted-foreground">Maximum number of participants</p>
            </div>
          </div>

          {minGroupSize > maxGroupSize && (
            <p className="mt-4 text-sm text-red-500">
              ⚠ Minimum group size cannot be greater than maximum group size
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
