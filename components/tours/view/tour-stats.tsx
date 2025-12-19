import { Tour } from '@/services/tour.service';
import { Calendar, IndianRupee, Star, Users, Eye, ShoppingCart } from 'lucide-react';

interface TourStatsProps {
  tour: Tour;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-3">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

export function TourStats({ tour }: TourStatsProps) {
  const stats = [
    {
      icon: <Calendar className="h-4 w-4 text-blue-600" />,
      label: 'Duration',
      value: `${tour.durationDays}D/${tour.durationNights}N`,
    },
    {
      icon: <IndianRupee className="h-4 w-4 text-green-600" />,
      label: 'Price',
      value: `₹${tour.price.toLocaleString()}`,
    },
    {
      icon: <Star className="h-4 w-4 text-yellow-600" />,
      label: 'Rating',
      value: Number(tour.rating).toFixed(1),
    },
    {
      icon: <Users className="h-4 w-4 text-purple-600" />,
      label: 'Group Size',
      value: `${tour.minGroupSize}-${tour.maxGroupSize}`,
    },
    {
      icon: <Eye className="h-4 w-4 text-orange-600" />,
      label: 'Views',
      value: tour.viewCount.toString(),
    },
    {
      icon: <ShoppingCart className="h-4 w-4 text-pink-600" />,
      label: 'Bookings',
      value: tour.bookingCount.toString(),
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
}
