import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/crm-utils';
import { cn } from '@/lib/utils';
import { Lead } from '@/types/crm.types';
import { Activity, Bell, Clock, TrendingUp } from 'lucide-react';

interface LeadStatsCardsProps {
  lead: Lead;
}

export function LeadStatsCards({ lead }: LeadStatsCardsProps) {
  const stats = [
    {
      label: 'Lead Score',
      value: `${lead.leadScore}/100`,
      subValue:
        lead.leadScore > 70
          ? 'High probability'
          : lead.leadScore > 40
          ? 'Moderate'
          : 'Low probability',
      icon: Activity,
      color:
        lead.leadScore > 70
          ? 'text-green-600 bg-green-50'
          : lead.leadScore > 40
          ? 'text-yellow-600 bg-yellow-50'
          : 'text-red-600 bg-red-50',
    },
    {
      label: 'Estimated Value',
      value: formatCurrency(lead.estimatedValue),
      subValue: 'Potential revenue',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Response Time',
      value: lead.responseTimeMinutes
        ? lead.responseTimeMinutes > 60
          ? `${Math.floor(lead.responseTimeMinutes / 60)}h ${lead.responseTimeMinutes % 60}m`
          : `${lead.responseTimeMinutes}m`
        : 'N/A',
      subValue: 'Avg. response',
      icon: Clock,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Follow-ups',
      value: lead.followUpCount,
      subValue: 'Total interactions',
      icon: Bell,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subValue}</p>
              </div>
              <div className={cn('p-3 rounded-lg', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
