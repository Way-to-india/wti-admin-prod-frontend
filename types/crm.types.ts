// CRM Lead Types
export interface Lead {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  alternatePhone: string | null;
  city: string | null;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  quality: LeadQuality | null;
  serviceType: LeadServiceType | null;
  destination: string | null;
  travelStartDate: Date | null;
  travelEndDate: Date | null;
  numberOfTravelers: number | null;
  numberOfAdults: number | null;
  numberOfChildren: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  specialRequests: string | null;
  
  tagId: string | null;
  categoryId: string | null;
  assignedToId: string | null;
  assignedAt: Date | null;
  
  leadScore: number;
  conversionProbability: number | null;
  estimatedValue: number | null;
  actualValue: number | null;
  
  contactedAt: Date | null;
  firstResponseAt: Date | null;
  responseTimeMinutes: number | null;
  lastActivityAt: Date | null;
  nextFollowUpAt: Date | null;
  followUpCount: number;
  isOverdue: boolean;
  
  lostReason: string | null;
  closedAt: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  tag?: LeadTag;
  category?: LeadCategory;
  assignedTo?: AdminUser;
  notes?: LeadNote[];
  quotations?: LeadQuotation[];
  communications?: LeadCommunication[];
  reminders?: LeadReminder[];
}

export type LeadSource = 
  | 'WEBSITE_FORM' | 'PHONE_CALL' | 'EMAIL' | 'WHATSAPP'
  | 'FACEBOOK' | 'INSTAGRAM' | 'GOOGLE_ADS' | 'REFERRAL'
  | 'WALK_IN' | 'OTHER';

export type LeadStatus =
  | 'NEW' | 'CONTACTED' | 'INTERESTED' | 'QUOTED'
  | 'NEGOTIATING' | 'FOLLOW_UP_SCHEDULED' | 'CONFIRMED'
  | 'CLOSED_WON' | 'CLOSED_LOST' | 'NOT_INTERESTED';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD';
export type LeadQuality = 'A' | 'B' | 'C';
export type LeadServiceType = 'TOUR' | 'HOTEL' | 'TRANSPORT' | 'MIXED';

export interface LeadTag {
  id: string;
  name: string;
  label: string;
  color: string;
  icon: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface LeadCategory {
  id: string;
  name: string;
  label: string;
  icon: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  attachments: string[];
  createdById: string;
  createdAt: Date;
  createdBy?: AdminUser;
}

export interface LeadQuotation {
  id: string;
  leadId: string;
  version: number;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  description: string | null;
  amount: number | null;
  isAccepted: boolean;
  acceptedAt: Date | null;
  emailOpenedAt: Date | null;
  uploadedById: string;
  createdAt: Date;
  uploadedBy?: AdminUser;
}

export interface LeadCommunication {
  id: string;
  leadId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string | null;
  content: string | null;
  duration: number | null;
  status: string | null;
  metadata: any;
  performedById: string;
  createdAt: Date;
  performedBy?: AdminUser;
}

export type CommunicationType = 'CALL' | 'EMAIL' | 'WHATSAPP' | 'SMS' | 'MEETING' | 'OTHER';
export type CommunicationDirection = 'INBOUND' | 'OUTBOUND';

export interface LeadReminder {
  id: string;
  leadId: string;
  scheduledFor: Date;
  reminderType: ReminderType;
  notes: string | null;
  isCompleted: boolean;
  completedAt: Date | null;
  isSnoozed: boolean;
  snoozedUntil: Date | null;
  snoozeReason: string | null;
  assignedToId: string;
  createdById: string;
  createdAt: Date;
  assignedTo?: AdminUser;
  lead?: Lead;
}

export type ReminderType = 'FOLLOW_UP' | 'CALLBACK' | 'QUOTE_FOLLOW_UP' | 'GENERAL';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

// Request/Response Types
export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateLeadData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  alternatePhone?: string;
  city?: string;
  source: LeadSource;
  serviceType?: LeadServiceType;
  destination?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  numberOfTravelers?: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  budgetMin?: number;
  budgetMax?: number;
  specialRequests?: string;
  priority?: LeadPriority;
  quality?: LeadQuality;
  tagId?: string;
  categoryId?: string;
  assignedToId?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  estimatedValue?: number;
  actualValue?: number;
  lostReason?: string;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  quality?: LeadQuality;
  source?: LeadSource;
  serviceType?: LeadServiceType;
  assignedToId?: string;
  tagId?: string;
  categoryId?: string;
  createdFrom?: string;
  createdTo?: string;
  travelDateFrom?: string;
  travelDateTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  isOverdue?: boolean;
  hasFollowUpToday?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AssignLeadData {
  leadId: string;
  assignedToId: string;
  notes?: string;
}

export interface UpdateLeadStatusData {
  leadId: string;
  status: LeadStatus;
  tagId?: string;
  notes?: string;
}

export interface AddNoteData {
  leadId: string;
  content: string;
  attachments?: string[];
}

export interface CreateReminderData {
  leadId: string;
  scheduledFor: string;
  reminderType: ReminderType;
  notes?: string;
  assignedToId?: string;
}

export interface SnoozeReminderData {
  reminderId: string;
  snoozedUntil: string;
  snoozeReason?: string;
}

export interface LogCommunicationData {
  leadId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  content?: string;
  duration?: number;
  status?: string;
  metadata?: any;
}

export interface UploadQuotationData {
  leadId: string;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  description?: string;
  amount?: number;
}

// Analytics Types
export interface DashboardSummary {
  conversionMetrics: ConversionMetrics;
  todaysLeads: number;
  overdueFollowups: number;
  hotLeads: number;
  recentActivity: number;
}

export interface ConversionMetrics {
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  confirmedLeads: number;
  closedWonLeads: number;
  closedLostLeads: number;
  notInterestedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  estimatedRevenue: number;
}

export interface AdminPerformance {
  admin: AdminUser;
  metrics: {
    totalLeads: number;
    activeLeads: number;
    convertedLeads: number;
    overdueLeads: number;
    conversionRate: number;
    avgResponseTimeMinutes: number;
    totalRevenue: number;
  };
}

export interface SourceROI {
  source: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  estimatedRevenue: number;
  avgLeadValue: number;
}

export interface LeadPipelineStage {
  status: string;
  count: number;
  totalValue: number;
}
