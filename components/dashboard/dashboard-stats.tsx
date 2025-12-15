// components/dashboard/dashboard-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconUsers,
  IconMap2,
  IconStar,
  IconCurrencyRupee,
  IconUserCheck,
  IconTicket,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';

interface StatsProps {
  data: {
    users: any;
    tours: any;
    reviews: any;
    bookings: any;
    admins: any;
    leads: any;
  };
}

export function DashboardStats({ data }: StatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data?.users?.total || 0,
      change: data?.users?.growthRate,
      icon: IconUsers,
      description: `${data?.users?.active || 0} active users`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Total Tours',
      value: data?.tours?.total || 0,
      change: data?.tours?.growthRate,
      icon: IconMap2,
      description: `${data?.tours?.featured || 0} featured tours`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Reviews',
      value: data?.reviews?.total || 0,
      change: data?.reviews?.growthRate,
      icon: IconStar,
      description: `Avg rating: ${data?.reviews?.averageRating || 0}`,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      title: 'Total Bookings',
      value: data?.bookings?.total || 0,
      change: null,
      icon: IconTicket,
      description: `₹${(data?.bookings?.estimatedRevenue || 0).toLocaleString()}`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Active Admins',
      value: data?.admins?.active || 0,
      change: null,
      icon: IconUserCheck,
      description: `${data?.admins?.roles || 0} roles`,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      title: 'Total Leads',
      value: data?.leads?.total || 0,
      change: data?.leads?.conversionRate,
      icon: IconCurrencyRupee,
      description: `${data?.leads?.new || 0} new leads`,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change && parseFloat(stat.change) > 0;
        const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.change && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
