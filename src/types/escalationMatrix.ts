
export interface EscalationLevel {
  id: string;
  level: 'E1' | 'E2' | 'E3' | 'E4' | 'E5';
  escalationTo: string;
}

export interface PriorityTiming {
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  days: number;
  hours: number;
  minutes: number;
}

export interface ResponseEscalationRule {
  id: string;
  categoryType: string;
  escalationLevels: EscalationLevel[];
  priorityTimings: PriorityTiming[];
  createdOn: string;
  createdBy: string;
  active: boolean;
}

export interface ResolutionEscalationRule {
  id: string;
  categoryType: string;
  escalationLevels: EscalationLevel[];
  createdOn: string;
  createdBy: string;
  active: boolean;
}

export const ESCALATION_LEVELS = ['E1', 'E2', 'E3', 'E4', 'E5'] as const;
export const PRIORITY_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5'] as const;

export const ESCALATION_TO_OPTIONS = [
  'Supervisor',
  'Manager',
  'Senior Manager',
  'Director',
  'VP',
  'Admin',
  'Technical Lead',
  'Team Lead'
];

// New interfaces for API integration
export interface HelpdeskCategory {
  id: number;
  name: string;
}

export interface FMUserDropdown {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  displayName: string; // "firstname lastname"
}

export interface EscalationMatrixPayload {
  complaint_worker: {
    society_id: number;
    esc_type: string;
    of_phase: string;
    of_atype: string;
  };
  category_ids: number[];
  escalation_matrix: {
    e1: { name: string; escalate_to_users: number[] };
    e2: { name: string; escalate_to_users: number[] };
    e3: { name: string; escalate_to_users: number[] };
    e4: { name: string; escalate_to_users: number[] };
    e5: { name: string; escalate_to_users: number[] };
  };
}

export interface ResponseEscalationApiFormData {
  categoryIds: number[];
  escalationLevels: {
    e1: number[];
    e2: number[];
    e3: number[];
    e4: number[];
    e5: number[];
  };
}

// Resolution Escalation API interfaces
export interface ResolutionEscalationMatrixLevel {
  name: string;
  escalate_to_users?: number[];
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
}

export interface ResolutionEscalationMatrixPayload {
  complaint_worker: {
    society_id: number;
    esc_type: string;
    of_phase: string;
    of_atype: string;
  };
  category_ids: number[];
  escalation_matrix: {
    e1: ResolutionEscalationMatrixLevel;
    e2: ResolutionEscalationMatrixLevel;
    e3: ResolutionEscalationMatrixLevel;
    e4: ResolutionEscalationMatrixLevel;
    e5: ResolutionEscalationMatrixLevel;
  };
}

export interface ResolutionEscalationApiFormData {
  categoryIds: number[];
  escalationLevels: {
    e1: { users: number[]; priorities: { p1: number; p2: number; p3: number; p4: number; p5: number; } };
    e2: { users: number[]; priorities: { p1: number; p2: number; p3: number; p4: number; p5: number; } };
    e3: { users: number[]; priorities: { p1: number; p2: number; p3: number; p4: number; p5: number; } };
    e4: { users: number[]; priorities: { p1: number; p2: number; p3: number; p4: number; p5: number; } };
    e5: { users: number[]; priorities: { p1: number; p2: number; p3: number; p4: number; p5: number; } };
  };
}

// GET API Response Types
export interface EscalationItem {
  id: number;
  society_id: number;
  name: string;
  after_days: number | null;
  escalate_to_users: string | number[] | null;
  created_at: string;
  updated_at: string;
  complaint_status_id: number | null;
  active: number | null;
  p1: number | null;
  p2: number | null;
  p3: number | null;
  p4: number | null;
  p5: number | null;
  cw_id: number;
  esc_type: string | null;
  resource_id: number | null;
  resource_type: string | null;
  copy_to: string | null;
}

export interface ResponseEscalationGetResponse {
  id: number;
  society_id: number;
  issue_type_id: number | null;
  category_id: number;
  assign_to: number | null;
  created_at: string;
  updated_at: string;
  assign: any | null;
  esc_type: string;
  of_phase: string;
  of_atype: string;
  cloned_by_id: number | null;
  cloned_at: string | null;
  site_id: number | null;
  issue_related_to: string | null;
  escalations: EscalationItem[];
}

export interface ResolutionEscalationGetResponse {
  id: number;
  society_id: number;
  issue_type_id: number | null;
  category_id: number;
  assign_to: number | null;
  created_at: string;
  updated_at: string;
  assign: any | null;
  esc_type: string;
  of_phase: string;
  of_atype: string;
  cloned_by_id: number | null;
  cloned_at: string | null;
  site_id: number | null;
  issue_related_to: string | null;
  escalations: EscalationItem[];
}

// Update API Payload Types
export interface UpdateResponseEscalationPayload {
  id: number;
  complaint_worker: {
    category_id: number;
  };
  escalation_matrix: {
    e1: { name: string; escalate_to_users: number[] };
    e2: { name: string; escalate_to_users: number[] };
    e3: { name: string; escalate_to_users: number[] };
    e4: { name: string; escalate_to_users: number[] };
    e5: { name: string; escalate_to_users: number[] };
  };
}

export interface UpdateResolutionEscalationPayload {
  id: number;
  complaint_worker: {
    category_id: number;
  };
  escalation_matrix: {
    e1: { name: string; escalate_to_users?: number[]; p1: number; p2: number; p3: number; p4: number; p5: number };
    e2: { name: string; escalate_to_users?: number[]; p1: number; p2: number; p3: number; p4: number; p5: number };
    e3: { name: string; escalate_to_users?: number[]; p1: number; p2: number; p3: number; p4: number; p5: number };
    e4: { name: string; escalate_to_users?: number[]; p1: number; p2: number; p3: number; p4: number; p5: number };
    e5: { name: string; escalate_to_users?: number[]; p1: number; p2: number; p3: number; p4: number; p5: number };
  };
}

// Delete API Payload Types
export interface DeleteComplaintWorkerPayload {
  id: number;
  complaint_worker: {
    assign: number;
  };
}
