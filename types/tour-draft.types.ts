export interface TourDraft {
  id: string;
  adminId: string;
  adminName?: string;
  draftData: any;
  draftName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourDraftData {
  draftData: any;
  draftName: string;
}

export interface UpdateTourDraftData {
  draftData?: any;
  draftName?: string;
}
