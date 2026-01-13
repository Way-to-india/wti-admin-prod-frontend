import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/crm-utils';
import { cn } from '@/lib/utils';
import { LeadCommunication, LeadNote } from '@/types/crm.types';
import { Mail, MessageCircle, MessageSquare, Phone, Plus, Send, Video } from 'lucide-react';
import { useState } from 'react';

interface LeadTimelineProps {
  notes: LeadNote[];
  communications: LeadCommunication[];
  onAddNote: (content: string) => Promise<void>;
  onLogCommunication: () => void;
}

export function LeadTimeline({
  notes,
  communications,
  onAddNote,
  onLogCommunication,
}: LeadTimelineProps) {
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
    } finally {
      setAddingNote(false);
    }
  };

  // Combine and sort activities
  const timelineItems = [
    ...notes.map((n) => ({
      ...n,
      type: 'NOTE' as const,
      timestamp: new Date(n.createdAt).getTime(),
    })),
    ...communications.map((c) => ({
      ...c,
      type: 'COMMUNICATION' as const,
      timestamp: new Date(c.createdAt).getTime(),
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const getCommIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return Phone;
      case 'EMAIL':
        return Mail;
      case 'WHATSAPP':
        return MessageCircle;
      case 'MEETING':
        return Video;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-4">
          {timelineItems.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="p-12 text-center text-slate-400">
                <ActivityIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No activity history yet.</p>
                <p className="text-sm">Start by adding a note or logging a call.</p>
              </CardContent>
            </Card>
          ) : (
            timelineItems.map((item, idx) => {
              const Icon = item.type === 'NOTE' ? MessageSquare : getCommIcon(item.type);

              return (
                <Card
                  key={`${item.type}-${item.id}`}
                  className="bg-white group hover:border-slate-300 transition-colors shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'mt-1 p-2 rounded-xl transition-transform group-hover:rotate-12',
                          item.type === 'NOTE'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-slate-900">
                            {item.type === 'NOTE'
                              ? 'Internal Note'
                              : `${item.type.replace('_', ' ')} logged`}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            {formatDate(item.createdAt, true)}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {item.type === 'NOTE' ? item.content : item.subject || item.content}
                        </p>
                        {item.type === 'COMMUNICATION' && item.duration && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-1.5 py-0.5 rounded">
                              Duration: {item.duration}s
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-1.5 py-0.5 rounded">
                              Direction: {item.direction}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Type internal note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px] border-slate-200 resize-none focus:ring-blue-100"
              />
              <Button
                onClick={handleAddNote}
                disabled={addingNote || !newNote.trim()}
                className="w-full shadow-sm bg-blue-600 hover:bg-blue-700 transition-all font-bold"
              >
                {addingNote ? 'Saving...' : 'Post Internal Note'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={onLogCommunication}
              className="w-full border-slate-200 hover:bg-slate-50 font-bold text-slate-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Log External Call/Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
