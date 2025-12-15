// components/dashboard/top-performers.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconStar, IconMapPin } from '@tabler/icons-react';

interface TopPerformersProps {
  data: {
    cities: any[];
    themes: any[];
  };
  showAll?: boolean;
}

export function TopPerformers({ data, showAll = false }: TopPerformersProps) {
  const cities = data?.cities || [];
  const themes = data?.themes || [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Top Cities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMapPin className="h-5 w-5 text-primary" />
            Top Cities
          </CardTitle>
          <CardDescription>Cities with most tours</CardDescription>
        </CardHeader>
        <CardContent>
          {cities.length > 0 ? (
            <div className="space-y-3">
              {cities.slice(0, showAll ? 10 : 5).map((city, index) => (
                <div key={city.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{city.name}</p>
                    {city.stateName && (
                      <p className="truncate text-xs text-muted-foreground">{city.stateName}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{city.tourCount} tours</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No cities data</div>
          )}
        </CardContent>
      </Card>

      {/* Top Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStar className="h-5 w-5 text-primary" />
            Top Themes
          </CardTitle>
          <CardDescription>Most popular tour themes</CardDescription>
        </CardHeader>
        <CardContent>
          {themes.length > 0 ? (
            <div className="space-y-3">
              {themes.slice(0, showAll ? 10 : 5).map((theme, index) => (
                <div key={theme.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{theme.label}</p>
                  </div>
                  <Badge variant="secondary">{theme.tourCount} tours</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No themes data</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
