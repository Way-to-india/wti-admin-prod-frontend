import { Tour } from '@/services/tour.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, TrendingUp, MapPin, IndianRupee, Info } from 'lucide-react';

interface DetailsTabProps {
  tour: Tour;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
}

export function DetailsTab({ tour }: DetailsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tour Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <InfoItem
                icon={<Clock className="mt-1 h-5 w-5 text-muted-foreground" />}
                label="Best Time to Visit"
                value={tour.bestTime || 'Not specified'}
              />
              <InfoItem
                icon={<Users className="mt-1 h-5 w-5 text-muted-foreground" />}
                label="Ideal For"
                value={tour.idealFor || 'Not specified'}
              />
              <InfoItem
                icon={<TrendingUp className="mt-1 h-5 w-5 text-muted-foreground" />}
                label="Difficulty Level"
                value={tour.difficulty || 'Not specified'}
              />
            </div>

            <div className="space-y-4">
              <InfoItem
                icon={<MapPin className="mt-1 h-5 w-5 text-muted-foreground" />}
                label="Start City"
                value={tour.startCity?.name || 'Not specified'}
              />
              <InfoItem
                icon={<IndianRupee className="mt-1 h-5 w-5 text-muted-foreground" />}
                label="Currency"
                value={tour.currency}
              />
              {tour.discountPrice && tour.discountPrice > 0 && (
                <InfoItem
                  icon={<IndianRupee className="mt-1 h-5 w-5 text-muted-foreground" />}
                  label="Discount Price"
                  value={`₹${tour.discountPrice.toLocaleString()}`}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {tour.travelTips && (
        <Card>
          <CardHeader>
            <CardTitle>Travel Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
              dangerouslySetInnerHTML={{ __html: tour.travelTips }}
            />
          </CardContent>
        </Card>
      )}

      {tour.cancellationPolicy && (
        <Card>
          <CardHeader>
            <CardTitle>Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{tour.cancellationPolicy}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
