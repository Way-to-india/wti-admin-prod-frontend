import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { X, Loader2, Globe, MapPin, Tag, AlertCircle } from 'lucide-react';
import { themeService, Theme } from '@/services/theme.service';
import { cityService, City } from '@/services/city.service';

interface SettingsTabProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
  metatitle: string;
  setMetatitle: (value: string) => void;
  metadesc: string;
  setMetadesc: (value: string) => void;
  themes: string[];
  setThemes: (value: string[]) => void;
  cities: string[];
  setCities: (value: string[]) => void;
}

export function SettingsTab({
  isActive,
  setIsActive,
  isFeatured,
  setIsFeatured,
  metatitle,
  setMetatitle,
  metadesc,
  setMetadesc,
  themes,
  setThemes,
  cities,
  setCities,
}: SettingsTabProps) {
  const [allThemes, setAllThemes] = useState<Theme[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [themesError, setThemesError] = useState<string | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [themeSearch, setThemeSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    fetchThemes();
    fetchCities();
  }, []);

  const fetchThemes = async () => {
    try {
      setIsLoadingThemes(true);
      setThemesError(null);
      const response = await themeService.getAllThemes({ limit: 1000 });
      setAllThemes(response.themes || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      setThemesError(error instanceof Error ? error.message : 'Failed to load themes');
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const fetchCities = async () => {
    try {
      setIsLoadingCities(true);
      setCitiesError(null);
      const response = await cityService.getAllCities({ limit: 1000 });
      setAllCities(response.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCitiesError(error instanceof Error ? error.message : 'Failed to load cities');
    } finally {
      setIsLoadingCities(false);
    }
  };

  const toggleTheme = (themeId: string) => {
    if (themes.includes(themeId)) {
      setThemes(themes.filter((id) => id !== themeId));
    } else {
      setThemes([...themes, themeId]);
    }
  };

  const toggleCity = (cityId: string) => {
    if (cities.includes(cityId)) {
      setCities(cities.filter((id) => id !== cityId));
    } else {
      setCities([...cities, cityId]);
    }
  };

  const filteredThemes = allThemes.filter((theme) =>
    theme.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  const filteredCities = allCities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Status Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Status</CardTitle>
          <CardDescription>Control the visibility and featured status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">Make this tour visible to customers</p>
            </div>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured" className="text-base">
                Featured Tour
              </Label>
              <p className="text-sm text-muted-foreground">Show this tour in featured section</p>
            </div>
            <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO Settings
          </CardTitle>
          <CardDescription>Optimize your tour for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metatitle">Meta Title</Label>
            <Input
              id="metatitle"
              value={metatitle}
              onChange={(e) => setMetatitle(e.target.value)}
              placeholder="Enter SEO title (defaults to tour title if empty)..."
              maxLength={60}
            />
            <p className="text-sm text-muted-foreground">
              {metatitle.length}/60 characters
              {metatitle.length > 50 && metatitle.length <= 60 && (
                <span className="text-orange-600"> (near limit)</span>
              )}
              {metatitle.length === 60 && <span className="text-red-600"> (at limit)</span>}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadesc">Meta Description</Label>
            <Textarea
              id="metadesc"
              value={metadesc}
              onChange={(e) => setMetadesc(e.target.value)}
              placeholder="Enter SEO description (defaults to tour overview if empty)..."
              rows={4}
              maxLength={160}
            />
            <p className="text-sm text-muted-foreground">
              {metadesc.length}/160 characters
              {metadesc.length > 140 && metadesc.length <= 160 && (
                <span className="text-orange-600"> (near limit)</span>
              )}
              {metadesc.length === 160 && <span className="text-red-600"> (at limit)</span>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tour Themes
          </CardTitle>
          <CardDescription>Select relevant themes for this tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {themes.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-lg border p-3 bg-muted/50">
              {themes.map((themeId) => {
                const theme = allThemes.find((t) => t.id === themeId);
                return theme ? (
                  <Badge key={themeId} variant="secondary" className="gap-1">
                    {theme.name}
                    <button
                      type="button"
                      onClick={() => toggleTheme(themeId)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {themesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {themesError}
                <button onClick={fetchThemes} className="ml-2 underline hover:no-underline">
                  Try again
                </button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Search themes..."
                value={themeSearch}
                onChange={(e) => setThemeSearch(e.target.value)}
              />
              {isLoadingThemes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredThemes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {themeSearch ? 'No themes found matching your search' : 'No themes available'}
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
                  {filteredThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`theme-${theme.id}`}
                        checked={themes.includes(theme.id)}
                        onChange={() => toggleTheme(theme.id)}
                        className="h-4 w-4 cursor-pointer"
                      />
                      <Label htmlFor={`theme-${theme.id}`} className="cursor-pointer flex-1">
                        {theme.name}
                        {theme.label && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({theme.label})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {themes.length} theme{themes.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Cities Covered
          </CardTitle>
          <CardDescription>Select cities included in this tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cities.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-lg border p-3 bg-muted/50">
              {cities.map((cityId) => {
                const city = allCities.find((c) => c.id === cityId);
                return city ? (
                  <Badge key={cityId} variant="secondary" className="gap-1">
                    {city.name}
                    <button
                      type="button"
                      onClick={() => toggleCity(cityId)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

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
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              {isLoadingCities ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredCities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {citySearch ? 'No cities found matching your search' : 'No cities available'}
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
                  {filteredCities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`city-${city.id}`}
                        checked={cities.includes(city.id)}
                        onChange={() => toggleCity(city.id)}
                        className="h-4 w-4 cursor-pointer"
                      />
                      <Label htmlFor={`city-${city.id}`} className="cursor-pointer flex-1">
                        {city.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {cities.length} {cities.length !== 1 ? 'cities' : 'city'} selected
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
