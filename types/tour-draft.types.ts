export interface TourDraft {
  id: string;
  adminId: string;
  adminName?: string;
  draftData: any;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourDraftData {
  draftData: any;
  title?: string;
}

export interface UpdateTourDraftData {
  draftData?: any;
  title?: string;
}
