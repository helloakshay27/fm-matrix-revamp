export interface ApprovalLevel {
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  approvers: string[];
}

export interface CostApprovalRule {
  id: string;
  costRange: {
    min: number;
    max: number;
  };
  accessLevel: 'User Level' | 'PM' | 'Both';
  unit: string;
  approvalLevels: ApprovalLevel[];
  createdOn: string;
  createdBy: string;
  active: boolean;
}

// API Types
export type CostUnit = 'between' | 'greater_than' | 'greater_than_equal';

export interface CostApprovalLevelAttribute {
  name: string;
  escalate_to_users: (number | string)[];
}

export interface CostApprovalPayload {
  cost_approval: {
    related_to: 'FM' | 'Project';
    level: string;
    cost_unit: CostUnit;
    cost_from?: number;
    cost_to: number;
    cost_approval_levels_attributes: CostApprovalLevelAttribute[];
  };
}

export interface FMUserDropdown {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface CostApprovalFormData {
  costUnit: CostUnit;
  costFrom?: number;
  costTo: number;
  approvalLevels: {
    level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    escalateToUsers: number[];
  }[];
}

export const APPROVAL_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;

export const ACCESS_LEVELS = ['User Level', 'PM'] as const;

export const MOCK_APPROVERS = [
  'Jayesh P',
  'Rajesh K',
  'Priya S',
  'Amit T',
  'Kavya R',
  'Suresh M',
  'Anita D',
  'Ravi N',
  'Sneha L',
  'Manoj B',
  'Divya A',
  'Kiran J',
  'Pooja V',
  'Arun C',
  'Meera H'
];

export const COST_UNITS = [
  { label: 'Between', value: 'between' as CostUnit },
  { label: 'Greater Than', value: 'greater_than' as CostUnit },
  { label: 'Greater Than Equal', value: 'greater_than_equal' as CostUnit },
];