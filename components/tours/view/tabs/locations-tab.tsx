import { Tour } from '@/services/tour.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, FileText } from 'lucide-react';

interface LocationsTabProps {
  tour: Tour;
}

export function LocationsTab({ tour }: LocationsTabProps) {
  return (
    <div className="space-y-4">
      {tour.themes && tour.themes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tour Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tour.themes.map((t, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {t.theme.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tour.cities && tour.cities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Cities Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {tour.cities.map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{c.city.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tour.startCity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Starting Point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">{tour.startCity.name}</p>
                <p className="text-sm text-muted-foreground">Tour starts from here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
