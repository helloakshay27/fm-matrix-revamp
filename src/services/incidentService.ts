export interface IncidentAttachment {
  id: number;
  relation: string;
  relation_id: number;
  active: number;
  url: string;
  doctype: string;
}

export interface IncidentWitness {
  id?: number;
  name: string;
  mobile: string;
  _destroy?: boolean;
}

export interface IncidentInvestigation {
  id?: number;
  name: string;
  mobile: string;
  designation: string;
  _destroy?: boolean;
}

export interface IncidentDetail {
  id?: number;
  equipment_property_damaged_cost?: number;
  production_loss?: number;
  treatment_cost?: number;
  absenteeism_cost?: number;
  other_cost?: number;
  first_aid_provided_employees?: boolean;
  name_first_aid_attendants?: string;
  sent_for_medical_treatment?: boolean;
  name_and_address_treatment_facility?: string;
  name_and_address_attending_physician?: string;
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
  rca_category_id: number | null;
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
  site_name: string | null;
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
  incident_detail: IncidentDetail | null;
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
  incident_witnesses?: IncidentWitness[];
  incident_investigations?: IncidentInvestigation[];
  probability?: number;
  inc_sub_sub_sub_category_id?: number;
  inc_sec_sub_sub_sub_category_id?: number;
}

export interface IncidentResponse {
  code: number;
  data: {
    total: number;
    incidents: Incident[];
    pagination?: {
      current_page: number;
      total_count: number;
      total_pages: number;
    };
  };
}

export interface IncidentCountsResponse {
  total_incidents: number;
  open: number;
  under_investigation: number;
  closed: number;
  pending: number;
  support_required: number;
}

// Real API service
export const incidentService = {
  async getIncidents(query?: string): Promise<IncidentResponse> {
    // Get baseUrl and token from localStorage
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }

    const url = `${baseUrl}/pms/incidents.json${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async getIncidentCounts(): Promise<IncidentCountsResponse> {
    // Get baseUrl and token from localStorage
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';

    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }

    const response = await fetch(`${baseUrl}/pms/incidents/counts.json`, {
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
    // Get baseUrl and token from localStorage
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }

    const response = await fetch(`${baseUrl}/pms/incidents/${id}.json`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // async updateIncident(id: string, formData: any): Promise<Incident> {
  //   // Get baseUrl and token from localStorage
  //   let baseUrl = localStorage.getItem('baseUrl') || '';
  //   const token = localStorage.getItem('token') || '';
    
  //   if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  //     baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
  //   }

  //   // Create FormData for the PUT request
  //   const body = new FormData();
    
  //   // Time fields
  //   if (formData.year) body.append('incident[inc_time(1i)]', formData.year);
  //   if (formData.month) {
  //     const monthNumber = ['January', 'February', 'March', 'April', 'May', 'June',
  //       'July', 'August', 'September', 'October', 'November', 'December']
  //       .indexOf(formData.month) + 1;
  //     body.append('incident[inc_time(2i)]', monthNumber.toString());
  //   }
  //   if (formData.day) body.append('incident[inc_time(3i)]', formData.day);
  //   if (formData.hour) body.append('incident[inc_time(4i)]', formData.hour);
  //   if (formData.minute) body.append('incident[inc_time(5i)]', formData.minute);
    
  //   // Basic fields
  //   if (formData.building) body.append('incident[building_id]', formData.building);
  //   if (formData.categoryForIncident) body.append('incident[inc_category_id]', formData.categoryForIncident);
  //   if (formData.primaryCategory) body.append('incident[inc_sub_category_id]', formData.primaryCategory);
  //   if (formData.subCategory) body.append('incident[inc_sub_sub_category_id]', formData.subCategory);
  //   if (formData.subSubCategory) body.append('incident[inc_sub_sub_sub_category_id]', formData.subSubCategory);
  //   if (formData.secondaryCategory) body.append('incident[inc_sec_category_id]', formData.secondaryCategory);
  //   if (formData.secondarySubCategory) body.append('incident[inc_sec_sub_category_id]', formData.secondarySubCategory);
  //   if (formData.secondarySubSubCategory) body.append('incident[inc_sec_sub_sub_category_id]', formData.secondarySubSubCategory);
  //   if (formData.secondarySubSubSubCategory) body.append('incident[inc_sec_sub_sub_sub_category_id]', formData.secondarySubSubSubCategory);
  //   if (formData.severity) body.append('incident[consequence_insignificant]', formData.severity);
  //   if (formData.probability) body.append('incident[probability]', formData.probability);
  //   if (formData.incidentLevel) body.append('incident[inc_level_id]', formData.incidentLevel);
  //   if (formData.description) body.append('incident[description]', formData.description);
  //   if (formData.rca) body.append('incident[rca]', formData.rca);
  //   if (formData.primaryRootCauseCategory) body.append('incident[rca_category_id]', formData.primaryRootCauseCategory);
  //   if (formData.correctiveAction) body.append('incident[corrective_action]', formData.correctiveAction);
  //   if (formData.preventiveAction) body.append('incident[preventive_action]', formData.preventiveAction);
    
  //   // Damage related fields
  //   if (formData.propertyDamageHappened !== undefined && formData.propertyDamageHappened !== '') {
  //     body.append('incident[property_damage]', formData.propertyDamageHappened);
  //   }
  //   if (formData.propertyDamageCategory) body.append('incident[property_damage_id]', formData.propertyDamageCategory);
  //   if (formData.damageCoveredInsurance !== undefined && formData.damageCoveredInsurance !== '') {
  //     body.append('incident[damage_covered_insurance]', formData.damageCoveredInsurance);
  //   }
  //   if (formData.damagedRecovered) body.append('incident[damaged_recovered]', formData.damagedRecovered);
  //   if (formData.insuredBy) body.append('incident[insured_by]', formData.insuredBy);
    
  //   // Witnesses
  //   if (formData.witnesses && formData.witnesses.length > 0) {
  //     formData.witnesses.forEach((witness: any, index: number) => {
  //       if (witness.id) body.append(`incident[incident_witnesses_attributes][${index}][id]`, witness.id);
  //       if (witness.name) body.append(`incident[incident_witnesses_attributes][${index}][name]`, witness.name);
  //       if (witness.mobile) body.append(`incident[incident_witnesses_attributes][${index}][mobile]`, witness.mobile);
  //       body.append(`incident[incident_witnesses_attributes][${index}][_destroy]`, witness._destroy ? 'true' : 'false');
  //     });
  //   }
    
  //   // Cost details - only send if there are actual values
  //   const hasIncidentDetailData = 
  //     formData.equipmentPropertyDamagedCost || 
  //     formData.productionLoss || 
  //     formData.treatmentCost || 
  //     formData.absenteeismCost || 
  //     formData.otherCost ||
  //     formData.firstAidProvided ||
  //     formData.firstAidAttendants ||
  //     formData.medicalTreatment ||
  //     formData.treatmentFacility ||
  //     formData.attendingPhysician;

  //   if (hasIncidentDetailData) {
  //     // Include the incident detail ID for updates if it exists - using index-based structure
  //     if (formData.incidentDetailId) {
  //       body.append(`incident[incident_detail_attributes][id]`, formData.incidentDetailId.toString());
  //     }
  //     if (formData.equipmentPropertyDamagedCost) body.append(`incident[incident_detail_attributes][equipment_property_damaged_cost]`, formData.equipmentPropertyDamagedCost);
  //     if (formData.productionLoss) body.append(`incident[incident_detail_attributes][production_loss]`, formData.productionLoss);
  //     if (formData.treatmentCost) body.append(`incident[incident_detail_attributes][treatment_cost]`, formData.treatmentCost);
  //     if (formData.absenteeismCost) body.append(`incident[incident_detail_attributes][absenteeism_cost]`, formData.absenteeismCost);
  //     if (formData.otherCost) body.append(`incident[incident_detail_attributes][other_cost]`, formData.otherCost);
  //     body.append(`incident[incident_detail_attributes][_destroy]`, 'false');
      
  //     // First aid and medical treatment - only send if we're sending incident_detail_attributes
  //     body.append(`incident[incident_detail_attributes][first_aid_provided_employees]`, formData.firstAidProvided ? '1' : '0');
  //     if (formData.firstAidAttendants) body.append(`incident[incident_detail_attributes][name_first_aid_attendants]`, formData.firstAidAttendants);
  //     body.append(`incident[incident_detail_attributes][sent_for_medical_treatment]`, formData.medicalTreatment ? '1' : '0');
  //     if (formData.treatmentFacility) body.append(`incident[incident_detail_attributes][name_and_address_treatment_facility]`, formData.treatmentFacility);
  //     if (formData.attendingPhysician) body.append(`incident[incident_detail_attributes][name_and_address_attending_physician]`, formData.attendingPhysician);
  //   }
    
  //   // Investigation team
  //   if (formData.investigationTeam && formData.investigationTeam.length > 0) {
  //     formData.investigationTeam.forEach((member: any, index: number) => {
  //       if (member.id) body.append(`incident[incident_investigations_attributes][${index}][id]`, member.id);
  //       if (member.name) body.append(`incident[incident_investigations_attributes][${index}][name]`, member.name);
  //       if (member.mobile) body.append(`incident[incident_investigations_attributes][${index}][mobile]`, member.mobile);
  //       if (member.designation) body.append(`incident[incident_investigations_attributes][${index}][designation]`, member.designation);
  //       body.append(`incident[incident_investigations_attributes][${index}][_destroy]`, member._destroy ? 'true' : 'false');
  //     });
  //   }
    
  //   // Support and disclaimer
  //   body.append('incident[support_required]', formData.supportRequired ? '1' : '0');
  //   body.append('incident[disclaimer]', formData.factsCorrect ? '1' : '0');
    
  //   // Attachments - use noticeboard[files_attached][] for each file (API requirement)
  //   if (formData.newAttachments && Array.isArray(formData.newAttachments) && formData.newAttachments.length > 0) {
  //     formData.newAttachments.forEach((file: File) => {
  //       body.append('noticeboard[files_attached][]', file);
  //     });
  //   } else if (formData.attachments) {
  //     // Fallback: if no newAttachments array but single attachment exists
  //     body.append('noticeboard[files_attached][]', formData.attachments);
  //   }
    
  //   // Add commit parameter
  //   body.append('commit', 'Update Incident');

  //   const response = await fetch(`${baseUrl}/pms/incidents/${id}.json`, {
  //     method: 'PUT',
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: body
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   return await response.json();
  // }



  async updateIncident(id: string, formData: any): Promise<Incident> {
    // Get baseUrl and token from localStorage
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }

    // Create FormData for the PUT request
    const body = new FormData();
    
    // Time fields
    if (formData.year) body.append('incident[inc_time(1i)]', formData.year);
    if (formData.month) {
      const monthNumber = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
        .indexOf(formData.month) + 1;
      body.append('incident[inc_time(2i)]', monthNumber.toString());
    }
    if (formData.day) body.append('incident[inc_time(3i)]', formData.day);
    if (formData.hour) body.append('incident[inc_time(4i)]', formData.hour);
    if (formData.minute) body.append('incident[inc_time(5i)]', formData.minute);
    
    // Basic fields
    if (formData.building) body.append('incident[building_id]', formData.building);
    if (formData.primaryCategory) body.append('incident[inc_category_id]', formData.primaryCategory);
    if (formData.subCategory) body.append('incident[inc_sub_category_id]', formData.subCategory);
    if (formData.subSubCategory) body.append('incident[inc_sub_sub_category_id]', formData.subSubCategory);
    if (formData.subSubSubCategory) body.append('incident[inc_sub_sub_sub_category_id]', formData.subSubSubCategory);
    if (formData.secondaryCategory) body.append('incident[inc_sec_category_id]', formData.secondaryCategory);
    if (formData.secondarySubCategory) body.append('incident[inc_sec_sub_category_id]', formData.secondarySubCategory);
    if (formData.secondarySubSubCategory) body.append('incident[inc_sec_sub_sub_category_id]', formData.secondarySubSubCategory);
    if (formData.secondarySubSubSubCategory) body.append('incident[inc_sec_sub_sub_sub_category_id]', formData.secondarySubSubSubCategory);
    if (formData.severity) body.append('incident[consequence_insignificant]', formData.severity);
    if (formData.probability) body.append('incident[probability]', formData.probability);
    if (formData.incidentLevel) body.append('incident[inc_level_id]', formData.incidentLevel);
    if (formData.description) body.append('incident[description]', formData.description);
    if (formData.rca) body.append('incident[rca]', formData.rca);
    if (formData.primaryRootCauseCategory) body.append('incident[rca_category_id]', formData.primaryRootCauseCategory);
    if (formData.correctiveAction) body.append('incident[corrective_action]', formData.correctiveAction);
    if (formData.preventiveAction) body.append('incident[preventive_action]', formData.preventiveAction);
    
    // Damage related fields
    if (formData.propertyDamageHappened !== undefined && formData.propertyDamageHappened !== '') {
      body.append('incident[property_damage]', formData.propertyDamageHappened);
    }
    if (formData.propertyDamageCategory) body.append('incident[property_damage_id]', formData.propertyDamageCategory);
    if (formData.damageCoveredInsurance !== undefined && formData.damageCoveredInsurance !== '') {
      body.append('incident[damage_covered_insurance]', formData.damageCoveredInsurance);
    }
    if (formData.damagedRecovered) body.append('incident[damaged_recovered]', formData.damagedRecovered);
    if (formData.insuredBy) body.append('incident[insured_by]', formData.insuredBy);
    
    // Witnesses
    if (formData.witnesses && formData.witnesses.length > 0) {
      formData.witnesses.forEach((witness: any, index: number) => {
        if (witness.id) body.append(`incident[incident_witnesses_attributes][${index}][id]`, witness.id);
        if (witness.name) body.append(`incident[incident_witnesses_attributes][${index}][name]`, witness.name);
        if (witness.mobile) body.append(`incident[incident_witnesses_attributes][${index}][mobile]`, witness.mobile);
        body.append(`incident[incident_witnesses_attributes][${index}][_destroy]`, witness._destroy ? 'true' : 'false');
      });
    }
    
    // Cost details - only send if there are actual values
    const hasIncidentDetailData = 
      formData.equipmentPropertyDamagedCost || 
      formData.productionLoss || 
      formData.treatmentCost || 
      formData.absenteeismCost || 
      formData.otherCost ||
      formData.firstAidProvided ||
      formData.firstAidAttendants ||
      formData.medicalTreatment ||
      formData.treatmentFacility ||
      formData.attendingPhysician;

    if (hasIncidentDetailData) {
      // Include the incident detail ID for updates if it exists - using index-based structure
      if (formData.incidentDetailId) {
        body.append(`incident[incident_detail_attributes][id]`, formData.incidentDetailId.toString());
      }
      if (formData.equipmentPropertyDamagedCost) body.append(`incident[incident_detail_attributes][equipment_property_damaged_cost]`, formData.equipmentPropertyDamagedCost);
      if (formData.productionLoss) body.append(`incident[incident_detail_attributes][production_loss]`, formData.productionLoss);
      if (formData.treatmentCost) body.append(`incident[incident_detail_attributes][treatment_cost]`, formData.treatmentCost);
      if (formData.absenteeismCost) body.append(`incident[incident_detail_attributes][absenteeism_cost]`, formData.absenteeismCost);
      if (formData.otherCost) body.append(`incident[incident_detail_attributes][other_cost]`, formData.otherCost);
      body.append(`incident[incident_detail_attributes][_destroy]`, 'false');
      
      // First aid and medical treatment - only send if we're sending incident_detail_attributes
      body.append(`incident[incident_detail_attributes][first_aid_provided_employees]`, formData.firstAidProvided ? '1' : '0');
      if (formData.firstAidAttendants) body.append(`incident[incident_detail_attributes][name_first_aid_attendants]`, formData.firstAidAttendants);
      body.append(`incident[incident_detail_attributes][sent_for_medical_treatment]`, formData.medicalTreatment ? '1' : '0');
      if (formData.treatmentFacility) body.append(`incident[incident_detail_attributes][name_and_address_treatment_facility]`, formData.treatmentFacility);
      if (formData.attendingPhysician) body.append(`incident[incident_detail_attributes][name_and_address_attending_physician]`, formData.attendingPhysician);
    }
    
    // Investigation team
    if (formData.investigationTeam && formData.investigationTeam.length > 0) {
      formData.investigationTeam.forEach((member: any, index: number) => {
        if (member.id) body.append(`incident[incident_investigations_attributes][${index}][id]`, member.id);
        if (member.name) body.append(`incident[incident_investigations_attributes][${index}][name]`, member.name);
        if (member.mobile) body.append(`incident[incident_investigations_attributes][${index}][mobile]`, member.mobile);
        if (member.designation) body.append(`incident[incident_investigations_attributes][${index}][designation]`, member.designation);
        body.append(`incident[incident_investigations_attributes][${index}][_destroy]`, member._destroy ? 'true' : 'false');
      });
    }
    
    // Support and disclaimer
    body.append('incident[support_required]', formData.supportRequired ? '1' : '0');
    body.append('incident[disclaimer]', formData.factsCorrect ? '1' : '0');
    
    // Attachments - use noticeboard[files_attached][] for each file (API requirement)
    if (formData.newAttachments && Array.isArray(formData.newAttachments) && formData.newAttachments.length > 0) {
      formData.newAttachments.forEach((file: File) => {
        body.append('noticeboard[files_attached][]', file);
      });
    } else if (formData.attachments) {
      // Fallback: if no newAttachments array but single attachment exists
      body.append('noticeboard[files_attached][]', formData.attachments);
    }
    
    // Add commit parameter
    body.append('commit', 'Update Incident');

    const response = await fetch(`${baseUrl}/pms/incidents/${id}.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};
