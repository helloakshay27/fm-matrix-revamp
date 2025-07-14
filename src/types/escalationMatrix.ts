
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
