'use client';

import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { TopPerformers } from '@/components/dashboard/top-performers';
import { TopTours } from '@/components/dashboard/top-tours';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconReload } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DashboardData {
  overview: any;
  analytics: any;
  distributions: any;
  trends: any;
  recent: any;
  topPerformers: any;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<DashboardData>(
        `/admin/dashboard?timeRange=${timeRange}`
      );
      if (response.status && response.payload) {
        setData(response.payload);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Failed to load dashboard</p>
          <Button className="mt-4 cursor-pointer" onClick={fetchDashboard}>
            <IconReload className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchDashboard} disabled={loading}>
            <IconReload className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="tours">
            Tours
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="leads">
            Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats data={data.overview} />
          <div className="grid gap-6 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <DashboardCharts data={data} />
            </div>
            <div className="lg:col-span-3">
              <RecentActivity data={data.recent} />
            </div>
          </div>
          <TopPerformers data={data.topPerformers} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DashboardCharts data={data} showAll />
        </TabsContent>

        <TabsContent value="tours" className="space-y-6">
          <TopTours analytics={data.analytics} />
          <TopPerformers data={data.topPerformers} showAll />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <RecentActivity data={data.recent} showLeadsOnly />
        </TabsContent>
      </Tabs>
    </div>
  );
}
