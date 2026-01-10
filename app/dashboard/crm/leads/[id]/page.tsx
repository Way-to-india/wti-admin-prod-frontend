'use client';

import { AssignLeadDialog } from '@/components/crm/assign-lead-dialog';
import { CreateReminderDialog } from '@/components/crm/create-reminder-dialog';
import { LeadDetailHeader } from '@/components/crm/lead-detail-header';
import { LeadOverview } from '@/components/crm/lead-overview';
import { LeadQuotationsTab } from '@/components/crm/lead-quotations-tab';
import { LeadRemindersTab } from '@/components/crm/lead-reminders-tab';
import { LeadStatsCards } from '@/components/crm/lead-stats-cards';
import { LeadTimeline } from '@/components/crm/lead-timeline';
import { LogCommunicationDialog } from '@/components/crm/log-communication-dialog';
import { QuotationUploadDialog } from '@/components/crm/quotation-upload-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { crmService } from '@/services/crm.service';
import type {
  Lead,
  LeadCommunication,
  LeadNote,
  LeadQuotation,
  LeadReminder,
} from '@/types/crm.types';
import { Bell, FileText, History, Info, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [reminders, setReminders] = useState<LeadReminder[]>([]);
  const [quotations, setQuotations] = useState<LeadQuotation[]>([]);
  const [communications, setCommunications] = useState<LeadCommunication[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isLogCommDialogOpen, setIsLogCommDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const timelineItemsCount = notes.length + communications.length;

  const fetchLeadDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [leadData, notesData, remindersData, quotationsData, commsData] = await Promise.all([
        crmService.getLeadById(leadId),
        crmService.getNotesByLeadId(leadId),
        crmService.getTodaysFollowups(),
        crmService.getQuotationsByLeadId(leadId),
        crmService.getCommunicationsByLeadId(leadId),
      ]);

      setLead(leadData);
      setNotes(notesData);
      setReminders(remindersData.filter((r) => r.leadId === leadId));
      setQuotations(quotationsData);
      setCommunications(commsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch lead details');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLeadDetails();
  }, [fetchLeadDetails]);

  const handleAddNote = async (content: string) => {
    try {
      await crmService.addNote({ leadId, content });
      toast.success('Note added successfully');
      fetchLeadDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add note');
      throw error;
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await crmService.updateLeadStatus({
        leadId,
        status: status as any,
      });
      toast.success('Status updated successfully');
      fetchLeadDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Syncing lead intelligence...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="p-4 bg-rose-50 rounded-full">
          <Info className="w-12 h-12 text-rose-500" />
        </div>
        <div className="text-2xl font-black text-slate-900">Lead vanished?</div>
        <p className="text-slate-500 max-w-xs text-center">
          We couldn't find the lead details you're looking for.
        </p>
        <Button
          onClick={() => router.push('/dashboard/crm/leads')}
          variant="outline"
          className="font-bold"
        >
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <LeadDetailHeader
        lead={lead}
        onStatusUpdate={handleUpdateStatus}
        onAssignClick={() => setIsAssignDialogOpen(true)}
        onEditClick={() => setIsEditDialogOpen(true)}
      />

      <LeadStatsCards lead={lead} />

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Info className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <History className="w-4 h-4 mr-2" />
              Timeline ({timelineItemsCount})
            </TabsTrigger>
            <TabsTrigger value="quotations">
              <FileText className="w-4 h-4 mr-2" />
              Quotations ({quotations.length})
            </TabsTrigger>
            <TabsTrigger value="plan">
              <Bell className="w-4 h-4 mr-2" />
              Plan ({reminders.length})
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => router.push('/dashboard/crm/leads/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <LeadOverview lead={lead} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <LeadTimeline
            notes={notes}
            communications={communications}
            onAddNote={handleAddNote}
            onLogCommunication={() => setIsLogCommDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="quotations" className="space-y-6">
          <LeadQuotationsTab
            quotations={quotations}
            onUploadClick={() => setIsQuotationDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          <LeadRemindersTab
            reminders={reminders}
            onCreateClick={() => setIsReminderDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <AssignLeadDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        leadId={leadId}
        currentAssigneeId={lead.assignedToId}
        onSuccess={fetchLeadDetails}
      />

      <QuotationUploadDialog
        open={isQuotationDialogOpen}
        onOpenChange={setIsQuotationDialogOpen}
        leadId={leadId}
        onSuccess={fetchLeadDetails}
      />

      <CreateReminderDialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
        leadId={leadId}
        onSuccess={fetchLeadDetails}
      />

      <LogCommunicationDialog
        open={isLogCommDialogOpen}
        onOpenChange={setIsLogCommDialogOpen}
        leadId={leadId}
        onSuccess={fetchLeadDetails}
      />
    </div>
  );
}
