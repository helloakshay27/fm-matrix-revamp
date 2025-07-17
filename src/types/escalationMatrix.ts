
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
