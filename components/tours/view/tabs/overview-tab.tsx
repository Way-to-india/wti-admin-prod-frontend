import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tour } from '@/types/tour.types';
import { CheckCircle, TrendingUp } from 'lucide-react';

interface OverviewTabProps {
  tour: Tour;
}

import { ReadMoreContainer } from '@/components/common/read-more-container';

export function OverviewTab({ tour }: OverviewTabProps) {
  return (
    <div className="space-y-4 cursor-pointer">
      {tour.overview && (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadMoreContainer maxHeight={150}>
              <div
                className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
                dangerouslySetInnerHTML={{ __html: tour.overview }}
              />
            </ReadMoreContainer>
          </CardContent>
        </Card>
      )}

      {tour.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <ReadMoreContainer maxHeight={200}>
              <div
                className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </ReadMoreContainer>
          </CardContent>
        </Card>
      )}

      {tour.highlights && tour.highlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tour Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {tour.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
