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
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface City {
  id: string;
  name: string;
}

interface BasicInfoTabProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  startCityId: string;
  setStartCityId: (value: string) => void;
  durationDays: number;
  setDurationDays: (value: number) => void;
  durationNights: number;
  setDurationNights: (value: number) => void;
}

export function BasicInfoTab({
  title,
  setTitle,
  slug,
  setSlug,
  startCityId,
  setStartCityId,
  durationDays,
  setDurationDays,
  durationNights,
  setDurationNights,
}: BasicInfoTabProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details of your tour package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tour Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., 12 Jyotirlinga Tour Package"
              required
            />
            <p className="text-sm text-muted-foreground">
              This will be the main heading of your tour
            </p>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              URL Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="12-jyotirlinga-tour-package"
              required
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly version of the title (auto-generated)
            </p>
          </div>

          {/* Duration */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="durationDays">
                Duration (Days) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationDays"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationNights">
                Duration (Nights) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationNights"
                type="number"
                min="0"
                value={durationNights}
                onChange={(e) => setDurationNights(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Start City */}
          <div className="space-y-2">
            <Label htmlFor="startCity">
              Starting City <span className="text-red-500">*</span>
            </Label>
            {isLoadingCities ? (
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading cities...</span>
              </div>
            ) : (
              <Select value={startCityId} onValueChange={setStartCityId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select starting city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground">Where does this tour begin?</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
