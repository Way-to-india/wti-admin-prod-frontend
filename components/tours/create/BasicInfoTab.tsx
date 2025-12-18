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
import { Loader2, AlertCircle } from 'lucide-react';
import { cityService, City } from '@/services/city.service';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [citiesError, setCitiesError] = useState<string | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setIsLoadingCities(true);
      setCitiesError(null);
      const response = await cityService.getAllCities({ limit: 1000 });
      setCities(response.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCitiesError(error instanceof Error ? error.message : 'Failed to load cities');
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
              onChange={(e) => setSlug(e.target.value)}
              placeholder="12-jyotirlinga-tour-package"
              required
            />
            <p className="text-sm text-muted-foreground">
              URL-friendly version of the title (auto-generated from title)
            </p>
            {slug && <p className="text-xs text-blue-600">Preview: /tours/{slug}</p>}
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
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                required
              />
              <p className="text-sm text-muted-foreground">Number of days for the tour</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationNights">
                Duration (Nights) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationNights"
                type="number"
                min="0"
                max="364"
                value={durationNights}
                onChange={(e) => setDurationNights(parseInt(e.target.value) || 0)}
                required
              />
              <p className="text-sm text-muted-foreground">Number of nights for the tour</p>
            </div>
          </div>

          {durationDays > 0 && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
              📅 Tour Duration:{' '}
              <strong>
                {durationDays} Days / {durationNights} Nights
              </strong>
            </div>
          )}

          {/* Start City */}
          <div className="space-y-2">
            <Label htmlFor="startCity">
              Starting City <span className="text-red-500">*</span>
            </Label>
            {citiesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {citiesError}
                  <button onClick={fetchCities} className="ml-2 underline hover:no-underline">
                    Try again
                  </button>
                </AlertDescription>
              </Alert>
            ) : isLoadingCities ? (
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading cities...</span>
              </div>
            ) : cities.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No cities available. Please add cities first or contact support.
                </AlertDescription>
              </Alert>
            ) : (
              <>
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
                <p className="text-sm text-muted-foreground">
                  Where does this tour begin? ({cities.length} cities available)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
