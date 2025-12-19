import { Tour } from '@/services/tour.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface InclusionsTabProps {
  tour: Tour;
}

interface ListItemProps {
  text: string;
  type: 'inclusion' | 'exclusion';
}

function ListItem({ text, type }: ListItemProps) {
  const isInclusion = type === 'inclusion';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 ${
        isInclusion ? 'border-green-100' : 'border-red-100'
      }`}
    >
      {isInclusion ? (
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <span className="text-sm">{text}</span>
    </div>
  );
}

export function InclusionsTab({ tour }: InclusionsTabProps) {
  return (
    <div className="space-y-4">
      {tour.inclusions && tour.inclusions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              What&apos;s Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tour.inclusions.map((inc, i) => (
                <ListItem key={i} text={inc} type="inclusion" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tour.exclusions && tour.exclusions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              What&apos;s Not Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tour.exclusions.map((exc, i) => (
                <ListItem key={i} text={exc} type="exclusion" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
