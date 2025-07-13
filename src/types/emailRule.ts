
export interface EmailRule {
  id: string;
  srNo: number;
  ruleName: string;
  triggerType: 'PPM' | 'AMC';
  triggerTo: 'Supplier' | 'Occupant Admin' | 'Other';
  role: string;
  periodValue: number;
  periodType: 'days' | 'weeks' | 'months';
  createdOn: string;
  createdBy: string;
  active: boolean;
}

export const TRIGGER_TYPES = ['PPM', 'AMC'] as const;
export const TRIGGER_TO_OPTIONS = ['Supplier', 'Occupant Admin', 'Other'] as const;
export const PERIOD_TYPES = ['days', 'weeks', 'months'] as const;
