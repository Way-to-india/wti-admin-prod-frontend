import { Tour } from '@/services/tour.service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TourHeaderProps {
  tour: Tour;
}

export function TourHeader({ tour }: TourHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{tour.title}</h1>
              <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                {tour.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {tour.isFeatured && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Slug: {tour.slug}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
