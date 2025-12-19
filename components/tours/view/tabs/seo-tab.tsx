import { Tour } from '@/services/tour.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface SeoTabProps {
  tour: Tour;
}

interface SeoFieldProps {
  label: string;
  value: string | number;
}

function SeoField({ label, value }: SeoFieldProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 rounded-lg border bg-muted p-3">{value}</p>
    </div>
  );
}

export function SeoTab({ tour }: SeoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          SEO Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SeoField label="Meta Title" value={tour.metatitle || 'Not set'} />
        <SeoField label="Meta Description" value={tour.metadesc || 'Not set'} />

        <div className="grid gap-4 md:grid-cols-2">
          <SeoField label="Review Count" value={tour.reviewCount} />
          <SeoField label="View Count" value={tour.viewCount} />
        </div>
      </CardContent>
    </Card>
  );
}
