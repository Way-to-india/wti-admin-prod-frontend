'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { crmService } from '@/services/crm.service';
import type { LeadReminder } from '@/types/crm.types';
import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function FollowUpsPage() {
  const router = useRouter();
  const [todaysFollowups, setTodaysFollowups] = useState<LeadReminder[]>([]);
  const [overdueFollowups, setOverdueFollowups] = useState<LeadReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      const [today, overdue] = await Promise.all([
        crmService.getTodaysFollowups(),
        crmService.getOverdueFollowups(),
      ]);
      setTodaysFollowups(today);
      setOverdueFollowups(overdue);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = async (reminderId: string) => {
    try {
      await crmService.completeReminder(reminderId);
      toast.success('Follow-up marked as completed');
      fetchFollowups();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete follow-up');
    }
  };

  const handleSnoozeReminder = async (reminderId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    try {
      await crmService.snoozeReminder({
        reminderId,
        snoozedUntil: tomorrow.toISOString(),
        snoozeReason: 'Snoozed to tomorrow',
      });
      toast.success('Follow-up snoozed to tomorrow');
      fetchFollowups();
    } catch (error: any) {
      toast.error(error.message || 'Failed to snooze follow-up');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const ReminderCard = ({
    reminder,
    isOverdue = false,
  }: {
    reminder: LeadReminder;
    isOverdue?: boolean;
  }) => (
    <Card className={isOverdue ? 'border-red-300 bg-red-50/50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isOverdue ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-semibold">{reminder.lead?.fullName || 'Unknown Lead'}</span>
              <Badge variant="outline">{reminder.reminderType.replace('_', ' ')}</Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground ml-7">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(reminder.scheduledFor)} at {formatTime(reminder.scheduledFor)}
                </span>
              </div>
              {reminder.notes && <p className="text-foreground mt-2">{reminder.notes}</p>}
              {reminder.lead && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs">📧 {reminder.lead.email}</span>
                  {reminder.lead.phoneNumber && (
                    <span className="text-xs">📞 {reminder.lead.phoneNumber}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button
              size="sm"
              onClick={() => router.push(`/dashboard/crm/leads/${reminder.leadId}`)}
            >
              View Lead
            </Button>
            {!reminder.isCompleted && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCompleteReminder(reminder.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSnoozeReminder(reminder.id)}
                >
                  Snooze
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading follow-ups...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground mt-1">Manage your scheduled follow-ups and reminders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Follow-ups</p>
                <p className="text-3xl font-bold mt-2">{todaysFollowups.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{overdueFollowups.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {todaysFollowups.filter((r) => r.isCompleted).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today ({todaysFollowups.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueFollowups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3">
          {todaysFollowups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p className="text-lg font-semibold">All caught up!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No follow-ups scheduled for today
                </p>
              </CardContent>
            </Card>
          ) : (
            todaysFollowups.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-3">
          {overdueFollowups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p className="text-lg font-semibold">Great job!</p>
                <p className="text-sm text-muted-foreground mt-1">No overdue follow-ups</p>
              </CardContent>
            </Card>
          ) : (
            overdueFollowups.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} isOverdue />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
