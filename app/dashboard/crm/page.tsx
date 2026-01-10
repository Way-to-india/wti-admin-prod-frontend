'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { crmService } from '@/services/crm.service';
import type { DashboardSummary } from '@/types/crm.types';
import { Activity, AlertCircle, Clock, Loader2, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CRMDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      const data = await crmService.getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-destructive">Failed to load dashboard</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Leads',
      value: summary.conversionMetrics.totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/dashboard/crm/leads',
    },
    {
      title: "Today's Leads",
      value: summary.todaysLeads,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/dashboard/crm/leads?today=true',
    },
    {
      title: 'Hot Leads',
      value: summary.hotLeads,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/dashboard/crm/leads?priority=HOT',
    },
    {
      title: 'Overdue Follow-ups',
      value: summary.overdueFollowups,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/dashboard/crm/follow-ups?overdue=true',
    },
    {
      title: 'Recent Activity',
      value: summary.recentActivity,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const conversionStats = [
    { label: 'Active Leads', value: summary.conversionMetrics.activeLeads },
    { label: 'Converted', value: summary.conversionMetrics.convertedLeads },
    { label: 'Conversion Rate', value: `${summary.conversionMetrics.conversionRate.toFixed(2)}%` },
    {
      label: 'Total Revenue',
      value: `₹${(summary.conversionMetrics.totalRevenue / 1000).toFixed(0)}K`,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your leads and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/dashboard/crm/leads/new')}>+ New Lead</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/crm/analytics')}>
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => stat.link && router.push(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {conversionStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/crm/leads')}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">View All Leads</h3>
            <p className="text-sm text-muted-foreground">Browse and manage all your leads</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/crm/follow-ups')}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Today's Follow-ups</h3>
            <p className="text-sm text-muted-foreground">Check your scheduled follow-ups</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/dashboard/crm/analytics')}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Analytics & Reports</h3>
            <p className="text-sm text-muted-foreground">View detailed performance metrics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
