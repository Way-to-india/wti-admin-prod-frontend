'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { crmService } from '@/services/crm.service';
import type { AdminPerformance, ConversionMetrics, SourceROI } from '@/types/crm.types';
import { Award, DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [conversion, setConversion] = useState<ConversionMetrics | null>(null);
  const [adminPerf, setAdminPerf] = useState<AdminPerformance[]>([]);
  const [sourceROI, setSourceROI] = useState<SourceROI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [conversionData, perfData, roiData] = await Promise.all([
        crmService.getConversionMetrics(),
        crmService.getAdminPerformance(),
        crmService.getSourceROI(),
      ]);
      setConversion(conversionData);
      setAdminPerf(perfData);
      setSourceROI(roiData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Track performance and conversion metrics</p>
      </div>

      {/* Conversion Metrics */}
      {conversion && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <p className="text-3xl font-bold mt-2">{conversion.totalLeads}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Converted</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {conversion.convertedLeads}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold mt-2">
                      {conversion.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">
                      ₹{(conversion.totalRevenue / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold mt-2">{conversion.activeLeads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {conversion.confirmedLeads}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Lost</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{conversion.closedLostLeads}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Admin Performance */}
      {adminPerf.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Admin Performance Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminPerf.map((perf, index) => (
                <div
                  key={perf.admin.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{perf.admin.name}</p>
                      <p className="text-sm text-muted-foreground">{perf.admin.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Leads</p>
                      <p className="text-lg font-bold">{perf.metrics.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Converted</p>
                      <p className="text-lg font-bold text-green-600">
                        {perf.metrics.convertedLeads}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="text-lg font-bold">{perf.metrics.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold">
                        ₹{(perf.metrics.totalRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source ROI */}
      {sourceROI.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceROI.map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{source.source.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.totalLeads} leads • {source.convertedLeads} converted
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                      <p className="text-lg font-bold">{source.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold">
                        ₹{(source.totalRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Value</p>
                      <p className="text-lg font-bold">
                        ₹{(source.avgLeadValue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
