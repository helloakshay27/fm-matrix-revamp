export interface IncidentAttachment {
  id: number;
  relation: string;
  relation_id: number;
  active: number;
  url: string;
  doctype: string;
}

export interface Incident {
  id: number;
  society_id: number | null;
  description: string;
  tower_id: number | null;
  floor_id: number | null;
  inc_time: string;
  inc_type_id: number | null;
  inc_category_id: number;
  inc_sub_category_id: number;
  inc_sub_sub_category_id: number;
  inc_level_id: number;
  rca: string | null;
  rca_category: string | null;
  loss: string | null;
  assigned_to: number | null;
  control: string | null;
  corrective_action: string | null;
  preventive_action: string | null;
  created_at: string;
  updated_at: string;
  support_required: boolean;
  created_by_id: number;
  hours_worked: number | null;
  severity: string | null;
  severity_brief: string | null;
  property_damage: string | null;
  damage_evaluation: string | null;
  damage_covered_insurance: string | null;
  insured_by: string | null;
  damaged_recovered: string | null;
  property_damage_id: number | null;
  inc_sec_category_id: number | null;
  inc_sec_sub_category_id: number | null;
  inc_sec_sub_sub_category_id: number | null;
  disclaimer: boolean;
  resource_id: number;
  resource_type: string;
  inci_date_time: string | null;
  action_owner: string | null;
  incident_closed: string | null;
  work_related_injury: string | null;
  building_id: number;
  current_status: string;
  tower_name: string | null;
  building_name: string;
  created_by: string;
  inc_level_name: string;
  inc_type_name: string | null;
  category_name: string | null;
  sub_category_name: string | null;
  sub_sub_category_name: string | null;
  sub_sub_sub_category_name: string | null;
  sec_category_name: string | null;
  sec_sub_category_name: string | null;
  sec_sub_sub_category_name: string | null;
  sec_sub_sub_sub_category_name: string | null;
  rca_category_name: string | null;
  property_damage_category_name: string | null;
  assigned_to_user_name: string | null;
  production_loss: number | null;
  treatment_cost: number | null;
  absenteeism_cost: number | null;
  incident_detail: string | null;
  other_cost: number | null;
  total_cost: number;
  equipment_property_damaged_cost: number | null;
  sent_for_medical_treatment: string;
  first_aid_provided: string;
  escalated_to: string;
  show_approve_btn: boolean;
  attachments: IncidentAttachment[];
  injuries: any[];
  logs: any[];
}

export interface IncidentResponse {
  code: number;
  data: {
    total: number;
    incidents: Incident[];
  };
}

// Real API service
export const incidentService = {
  async getIncidents(): Promise<IncidentResponse> {
    // Get baseUrl and token from localStorage
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }

    const response = await fetch(`${baseUrl}/pms/incidents.json`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    // Get all incidents and find the one with matching ID
    const response = await this.getIncidents();
    const incident = response.data.incidents.find(inc => inc.id.toString() === id);
    return incident || null;
  }
};
