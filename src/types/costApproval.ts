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

export const UNITS = [
  'Engineering',
  'Maintenance',
  'Operations',
  'IT',
  'Facilities',
  'Security',
  'HR',
  'Finance'
];