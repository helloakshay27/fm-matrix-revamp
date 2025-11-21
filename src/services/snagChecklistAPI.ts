import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

export interface SnagChecklistOption {
  id: number;
  qname: string;
  option_type: string;
}

export interface SnagChecklistQuestion {
  id: number;
  qtype: string;
  descr: string;
  checklist_id: number;
  img_mandatory: boolean;
  quest_mandatory: boolean;
  snag_quest_options: SnagChecklistOption[];
  stage_id: number | null;
  level_id: number | null;
  quest_stage: string;
  quest_level: string;
  quest_map_id: number | null;
}

export interface SnagChecklistAttachment {
  id: number;
  file_name: string;
  content_type: string;
  file_size: number;
  updated_at: string;
  url: string;
}

export interface SnagChecklistTicketConfig {
  category: string;
  category_id: number;
  assigned_to: string | null;
  assigned_to_id: number;
  tag_type: string | null;
  active: boolean;
  tag_created_at: string;
  tag_updated_at: string;
}

export interface SnagChecklist {
  id: number;
  name: string;
  snag_audit_category_id: number;
  snag_audit_sub_category_id: number | null;
  active: number;
  project_id: number | null;
  company_id: number;
  created_at: string;
  updated_at: string;
  check_type: string;
  user_id: number | null;
  resource_id: number;
  resource_type: string;
  snag_audit_category: string;
  snag_audit_sub_category: string | null;
  questions_count: number;
  snag_questions: SnagChecklistQuestion[];
  survey_attachment?: SnagChecklistAttachment | null;
  ticket_configs?: SnagChecklistTicketConfig | null;
  snag_attach_id?: number | null;
  snag_attach?: unknown | null;
}

export interface SnagChecklistResponse {
  data: SnagChecklist[];
}

export const fetchSnagChecklistById = async (id: string): Promise<SnagChecklist | null> => {
  try {
    const response = await apiClient.get(`/pms/admin/snag_checklists/${id}.json`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching snag checklist:', error);
    throw error;
  }
};

export const fetchSnagChecklistCategories = async (): Promise<any[]> => {
  try {
    // This would be a separate API call to get categories
    // For now, returning mock data - replace with actual API call
    return [
      { id: 296, name: "Safety" },
      { id: 297, name: "Quality" },
      { id: 298, name: "Compliance" }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};