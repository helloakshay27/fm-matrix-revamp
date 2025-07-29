import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

export interface SnagChecklistOption {
  id: number;
  qname: string;
  option_type: string;
}

export interface SnagChecklistQuestion {
  id: number;
  descr: string;
  options: SnagChecklistOption[];
}

export interface SnagChecklist {
  id: number;
  name: string;
  snag_audit_category_id: number;
  snag_audit_sub_category_id: number | null;
  check_type: string;
  questions: SnagChecklistQuestion[];
}

export interface SnagChecklistResponse {
  data: SnagChecklist[];
}

export const fetchSnagChecklistById = async (id: string): Promise<SnagChecklist | null> => {
  try {
    const response = await apiClient.get('/pms/admin/snag_checklists.json');
    const data: SnagChecklist[] = response.data;
    
    // Find the checklist by id
    const checklist = data.find(item => item.id.toString() === id);
    return checklist || null;
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