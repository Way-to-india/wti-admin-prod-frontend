// components/dashboard/top-tours.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconStar, IconEye, IconTicket, IconCurrencyRupee } from '@tabler/icons-react';
import Image from 'next/image';

interface TopToursProps {
  analytics: {
    topRatedTours: any[];
    mostViewedTours: any[];
    mostBookedTours: any[];
    topRevenueGeneratingTours: any[];
  };
}

export function TopTours({ analytics }: TopToursProps) {
  const topRated = analytics?.topRatedTours || [];
  const mostViewed = analytics?.mostViewedTours || [];
  const mostBooked = analytics?.mostBookedTours || [];
  const topRevenue = analytics?.topRevenueGeneratingTours || [];

  const TourCard = ({ tour, icon: Icon, iconColor, metric }: any) => (
    <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
        <Image
          src={tour.image || '/placeholder.jpg'}
          alt={tour.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{tour.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon className={`h-3 w-3 ${iconColor}`} />
            {metric}
          </span>
        </div>
      </div>
      <Badge variant="outline" className="shrink-0">
        ₹{tour.price?.toLocaleString() || 0}
      </Badge>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Top Rated Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStar className="h-5 w-5 text-yellow-500" />
            Top Rated Tours
          </CardTitle>
          <CardDescription>Highest customer ratings</CardDescription>
        </CardHeader>
        <CardContent>
          {topRated.length > 0 ? (
            <div className="space-y-3">
              {topRated.slice(0, 5).map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  icon={IconStar}
                  iconColor="text-yellow-500 fill-yellow-500"
                  metric={`${tour.rating?.toFixed(1) || 0} (${tour.reviewCount || 0} reviews)`}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Most Viewed Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5 text-blue-500" />
            Most Viewed Tours
          </CardTitle>
          <CardDescription>Highest page views</CardDescription>
        </CardHeader>
        <CardContent>
          {mostViewed.length > 0 ? (
            <div className="space-y-3">
              {mostViewed.slice(0, 5).map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  icon={IconEye}
                  iconColor="text-blue-500"
                  metric={`${(tour.viewCount || 0).toLocaleString()} views`}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Most Booked Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTicket className="h-5 w-5 text-green-500" />
            Most Booked Tours
          </CardTitle>
          <CardDescription>Highest number of bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {mostBooked.length > 0 ? (
            <div className="space-y-3">
              {mostBooked.slice(0, 5).map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  icon={IconTicket}
                  iconColor="text-green-500"
                  metric={`${(tour.bookingCount || 0).toLocaleString()} bookings`}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Top Revenue Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCurrencyRupee className="h-5 w-5 text-purple-500" />
            Top Revenue Tours
          </CardTitle>
          <CardDescription>Highest revenue generators</CardDescription>
        </CardHeader>
        <CardContent>
          {topRevenue.length > 0 ? (
            <div className="space-y-3">
              {topRevenue.slice(0, 5).map((tour) => (
                <div key={tour.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={tour.image || '/placeholder.jpg'}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{tour.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{tour.bookings || 0} bookings</span>
                      <span>•</span>
                      <span>₹{(tour.price || 0).toLocaleString()}/person</span>
                    </div>
                  </div>
                  <Badge className="shrink-0">₹{(tour.totalRevenue || 0).toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
