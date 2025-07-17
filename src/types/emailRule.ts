
export interface EmailRule {
  id: string;
  srNo: number;
  ruleName: string;
  triggerType: 'PPM' | 'AMC';
  triggerTo: 'Site Admin' | 'Occupant Admin' | 'Supplier';
  role: string;
  periodValue: number;
  periodType: 'days' | 'weeks' | 'months';
  createdOn: string;
  createdBy: string;
  active: boolean;
}

export const TRIGGER_TYPES = ['PPM', 'AMC'] as const;
export const TRIGGER_TO_OPTIONS = ['Site Admin', 'Occupant Admin', 'Supplier'] as const;
export const PERIOD_TYPES = ['days', 'weeks', 'months'] as const;
