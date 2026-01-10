import { apiClient } from '@/lib/api-client';
import type {
  AddNoteData,
  AdminPerformance,
  AssignLeadData,
  ConversionMetrics,
  CreateLeadData,
  CreateReminderData,
  DashboardSummary,
  Lead,
  LeadCategory,
  LeadCommunication,
  LeadFilters,
  LeadNote,
  LeadPipelineStage,
  LeadQuotation,
  LeadReminder,
  LeadsResponse,
  LeadTag,
  LogCommunicationData,
  SnoozeReminderData,
  SourceROI,
  UpdateLeadData,
  UpdateLeadStatusData,
  UploadQuotationData,
} from '@/types/crm.types';

export const crmService = {

  async getAllLeads(filters: LeadFilters = {}): Promise<LeadsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<LeadsResponse>(`/admin/crm/leads?${params.toString()}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch leads');
  },

  async getLeadById(id: string): Promise<Lead> {

    const response = await apiClient.get<Lead>(`/admin/crm/leads/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch lead');
  },

  async createLead(data: CreateLeadData): Promise<Lead> {

    const response = await apiClient.post<Lead>('/admin/crm/leads', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create lead');
  },

  async updateLead(id: string, data: UpdateLeadData): Promise<Lead> {

    const response = await apiClient.put<Lead>(`/admin/crm/leads/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update lead');
  },

  async deleteLead(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/crm/leads/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete lead');
    }
  },

  async assignLead(data: AssignLeadData): Promise<Lead> {

    const response = await apiClient.post<Lead>('/admin/crm/leads/assign', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to assign lead');
  },

  async updateLeadStatus(data: UpdateLeadStatusData): Promise<Lead> {

    const response = await apiClient.post<Lead>('/admin/crm/leads/status', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update lead status');
  },

  async bulkCreateLeads(leads: CreateLeadData[]): Promise<any> {

    const response = await apiClient.post('/admin/crm/leads/bulk', { leads });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to bulk create leads');
  },

  async getNotesByLeadId(leadId: string): Promise<LeadNote[]> {

    const response = await apiClient.get<LeadNote[]>(`/admin/crm/notes/lead/${leadId}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch notes');
  },

  async addNote(data: AddNoteData): Promise<LeadNote> {
    
    const response = await apiClient.post<LeadNote>('/admin/crm/notes', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to add note');
  },

  async updateNote(noteId: string, content: string, attachments?: string[]): Promise<LeadNote> {
    
    const response = await apiClient.put<LeadNote>(`/admin/crm/notes/${noteId}`, {
      noteId,
      content,
      attachments,
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update note');
  },

  async deleteNote(noteId: string): Promise<void> {
    
    const response = await apiClient.delete(`/admin/crm/notes/${noteId}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete note');
    }
  },

  async getTodaysFollowups(): Promise<LeadReminder[]> {
    
    const response = await apiClient.get<LeadReminder[]>('/admin/crm/reminders/today');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || "Failed to fetch today's follow-ups");
  },

  async getOverdueFollowups(): Promise<LeadReminder[]> {
    
    const response = await apiClient.get<LeadReminder[]>('/admin/crm/reminders/overdue');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch overdue follow-ups');
  },

  async createReminder(data: CreateReminderData): Promise<LeadReminder> {
    
    const response = await apiClient.post<LeadReminder>('/admin/crm/reminders', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create reminder');
  },

  async completeReminder(reminderId: string, notes?: string): Promise<LeadReminder> {
    
    const response = await apiClient.post<LeadReminder>('/admin/crm/reminders/complete', {
      reminderId,
      notes,
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to complete reminder');
  },

  async snoozeReminder(data: SnoozeReminderData): Promise<LeadReminder> {
    
    const response = await apiClient.post<LeadReminder>('/admin/crm/reminders/snooze', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to snooze reminder');
  },

  async getQuotationsByLeadId(leadId: string): Promise<LeadQuotation[]> {
    const response = await apiClient.get<LeadQuotation[]>(`/admin/crm/quotations/lead/${leadId}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch quotations');
  },

  async uploadQuotation(data: UploadQuotationData): Promise<LeadQuotation> {
    const response = await apiClient.post<LeadQuotation>('/admin/crm/quotations', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to upload quotation');
  },

  async markQuotationAccepted(quotationId: string): Promise<LeadQuotation> {
    
    const response = await apiClient.post<LeadQuotation>('/admin/crm/quotations/accept', {
      quotationId,
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to mark quotation as accepted');
  },

  async getCommunicationsByLeadId(leadId: string): Promise<LeadCommunication[]> {
    
    const response = await apiClient.get<LeadCommunication[]>(
      `/admin/crm/communications/lead/${leadId}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch communications');
  },

  async logCommunication(data: LogCommunicationData): Promise<LeadCommunication> {
    const response = await apiClient.post<LeadCommunication>('/admin/crm/communications', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to log communication');
  },

  // ============================================
  // CONFIGURATION
  // ============================================

  async getAllConfig(): Promise<{ tags: LeadTag[]; sources: any[]; categories: LeadCategory[] }> {
    const response = await apiClient.get('/admin/crm/config');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch configuration');
  },

  async getAllTags(): Promise<LeadTag[]> {
    const response = await apiClient.get<LeadTag[]>('/admin/crm/config/tags');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch tags');
  },

  async createTag(data: Partial<LeadTag>): Promise<LeadTag> {
    const response = await apiClient.post<LeadTag>('/admin/crm/config/tags', data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create tag');
  },

  async updateTag(id: string, data: Partial<LeadTag>): Promise<LeadTag> {
    const response = await apiClient.put<LeadTag>(`/admin/crm/config/tags/${id}`, data);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update tag');
  },

  async deleteTag(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/crm/config/tags/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete tag');
    }
  },

  // ============================================
  // ANALYTICS
  // ============================================

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>('/admin/crm/analytics/dashboard');

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch dashboard summary');
  },

  async getConversionMetrics(filters?: any): Promise<ConversionMetrics> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await apiClient.get<ConversionMetrics>(
      `/admin/crm/analytics/conversion?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch conversion metrics');
  },

  async getAdminPerformance(filters?: any): Promise<AdminPerformance[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await apiClient.get<AdminPerformance[]>(
      `/admin/crm/analytics/performance?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch admin performance');
  },

  async getSourceROI(filters?: any): Promise<SourceROI[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await apiClient.get<SourceROI[]>(
      `/admin/crm/analytics/source-roi?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch source ROI');
  },

  async getLeadPipeline(filters?: any): Promise<LeadPipelineStage[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await apiClient.get<LeadPipelineStage[]>(
      `/admin/crm/analytics/pipeline?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch lead pipeline');
  },
};
