import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/crm-utils';
import { cn } from '@/lib/utils';
import { LeadReminder } from '@/types/crm.types';
import { Activity, Bell } from 'lucide-react';

interface LeadRemindersTabProps {
  reminders: LeadReminder[];
  onCreateClick: () => void;
}

export function LeadRemindersTab({ reminders, onCreateClick }: LeadRemindersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black">Engagement Plan</h3>
        <Button
          className=" h-10 px-5 rounded-xl transition-all shadow-md group font-bold"
          onClick={onCreateClick}
        >
          <Bell className="w-4 h-4 mr-2 group-hover:shake" />
          Schedule Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.length === 0 ? (
          <div className="lg:col-span-3 p-16 text-center border-2 border-dashed rounded-2xl">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <p className="font-bold">Your calendar is empty for this lead.</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <Card
              key={reminder.id}
              className="border hover:shadow-lg transition-all rounded-xl overflow-hidden group"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'p-2 rounded-xl',
                      reminder.isCompleted
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-indigo-50 text-indigo-600'
                    )}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  {reminder.isCompleted && (
                    <Badge className="bg-slate-500 text-white border-none font-bold">Done</Badge>
                  )}
                </div>
                <div>
                  <p className="font-extrabold">
                    {reminder.reminderType.replace('_', ' ')}
                  </p>
                  <p className="text-xs font-bold mt-1">
                    {formatDate(reminder.scheduledFor, true)}
                  </p>
                </div>
                {reminder.notes && (
                  <p className="text-sm italic border-l-2 border-slate-100 pl-3 py-1">
                    "{reminder.notes}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
