import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import { EmailRule } from '@/types/emailRule';

interface CreateEmailRulePayload {
  pms_email_rule_setup: {
    trigger_to: string;
    period_type: string;
    period_value: string;
    active: number;
    rule_name: string;
    trigger_type: string;
    role_ids: string[];
  };
}

interface ApiEmailRule {
  id: number;
  rule_name: string;
  trigger_type: 'PPM' | 'AMC';
  trigger_to: 'Site Admin' | 'Occupant Admin' | 'Supplier';
  role_names: string;
  period_value: string;
  period_type: 'days' | 'weeks' | 'months';
  created_at: string;
  created_by_name: string;
  active: number;
}

const mapApiResponseToEmailRule = (apiRule: ApiEmailRule, index: number): EmailRule => {
  return {
    id: apiRule.id.toString(),
    srNo: index + 1,
    ruleName: apiRule.rule_name,
    triggerType: apiRule.trigger_type,
    triggerTo: apiRule.trigger_to,
    role: apiRule.role_names || 'N/A',
    periodValue: parseInt(apiRule.period_value) || 0,
    periodType: apiRule.period_type,
    createdOn: new Date(apiRule.created_at).toISOString().split('T')[0],
    createdBy: apiRule.created_by_name,
    active: apiRule.active === 1,
  };
};

// Mock data
export const mockEmailRules: EmailRule[] = [
  {
    id: '1',
    srNo: 1,
    ruleName: 'PPM Reminder - Equipment',
    triggerType: 'PPM',
    triggerTo: 'Supplier',
    role: 'Maintenance Manager',
    periodValue: 7,
    periodType: 'days',
    createdOn: '2024-01-15',
    createdBy: 'Admin User',
    active: true,
  },
  {
    id: '2',
    srNo: 2,
    ruleName: 'AMC Expiry Alert',
    triggerType: 'AMC',
    triggerTo: 'Occupant Admin',
    role: 'Facility Manager',
    periodValue: 30,
    periodType: 'days',
    createdOn: '2024-01-14',
    createdBy: 'System Admin',
    active: false,
  },
  {
    id: '3',
    srNo: 3,
    ruleName: 'Weekly PPM Check',
    triggerType: 'PPM',
    triggerTo: 'Site Admin',
    role: 'Technician',
    periodValue: 1,
    periodType: 'weeks',
    createdOn: '2024-01-13',
    createdBy: 'Admin User',
    active: true,
  },
];

export const emailRuleService = {
  async getEmailRules(): Promise<EmailRule[]> {
    let apiRules: EmailRule[] = [];
    try {
      const response = await apiClient.get<ApiEmailRule[]>(ENDPOINTS.EMAIL_RULES);
      if (response && response.data && Array.isArray(response.data)) {
        apiRules = response.data.map((rule, index) => mapApiResponseToEmailRule(rule, index));
      } else {
        apiRules = [...mockEmailRules];
      }
    } catch (error) {
      console.error('Failed to fetch email rules from API, using mock rules:', error);
      apiRules = [...mockEmailRules];
    }

    // Load any local rules stored in localStorage
    const localRulesJson = localStorage.getItem('local_email_rules');
    const localRules: EmailRule[] = localRulesJson ? JSON.parse(localRulesJson) : [];

    const finalRules = [...apiRules];
    localRules.forEach(localRule => {
      const index = finalRules.findIndex(r => r.id === localRule.id);
      if (index !== -1) {
        finalRules[index] = { ...finalRules[index], ...localRule };
      } else {
        if (!finalRules.some(r => r.ruleName.toLowerCase() === localRule.ruleName.toLowerCase())) {
          finalRules.push(localRule);
        }
      }
    });

    return finalRules.map((rule, index) => ({ ...rule, srNo: index + 1 }));
  },

  // Helper to save a rule to localStorage
  saveRuleLocally(data: {
    ruleName: string;
    triggerType: string;
    triggerTo: string;
    roleIds: string[];
    periodValue: number;
    periodType: string;
    roleNames?: string;
  }, existingId?: string): EmailRule {
    const localRulesJson = localStorage.getItem('local_email_rules');
    const localRules: EmailRule[] = localRulesJson ? JSON.parse(localRulesJson) : [];
    
    const id = existingId || `local_${Date.now()}`;
    
    const newRule: EmailRule = {
      id,
      srNo: localRules.length + 1,
      ruleName: data.ruleName,
      triggerType: data.triggerType as 'PPM' | 'AMC',
      triggerTo: data.triggerTo as 'Site Admin' | 'Occupant Admin' | 'Supplier',
      role: data.roleNames || 'N/A',
      periodValue: data.periodValue,
      periodType: data.periodType as 'days' | 'weeks' | 'months',
      createdOn: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      active: true,
    };

    const filteredRules = localRules.filter(r => r.id !== id && r.ruleName !== data.ruleName);
    filteredRules.push(newRule);
    localStorage.setItem('local_email_rules', JSON.stringify(filteredRules));
    return newRule;
  },

  // Helper to update a rule in localStorage
  updateRuleLocally(id: string, data: {
    ruleName: string;
    triggerType: string;
    triggerTo: string;
    roleIds: string[];
    periodValue: number;
    periodType: string;
    roleNames?: string;
  }): void {
    const localRulesJson = localStorage.getItem('local_email_rules');
    const localRules: EmailRule[] = localRulesJson ? JSON.parse(localRulesJson) : [];
    
    const updatedRules = localRules.map(rule => {
      if (rule.id === id) {
        return {
          ...rule,
          ruleName: data.ruleName,
          triggerType: data.triggerType as 'PPM' | 'AMC',
          triggerTo: data.triggerTo as 'Site Admin' | 'Occupant Admin' | 'Supplier',
          role: data.roleNames || rule.role,
          periodValue: data.periodValue,
          periodType: data.periodType as 'days' | 'weeks' | 'months',
        };
      }
      return rule;
    });

    localStorage.setItem('local_email_rules', JSON.stringify(updatedRules));
  },

  // Create new email rule
  async createEmailRule(data: {
    ruleName: string;
    triggerType: string;
    triggerTo: string;
    roleIds: string[];
    periodValue: number;
    periodType: string;
  }, roleNames?: string): Promise<any> {
    try {
      const payload: CreateEmailRulePayload = {
        pms_email_rule_setup: {
          rule_name: data.ruleName,
          trigger_type: data.triggerType,
          trigger_to: data.triggerTo,
          role_ids: data.roleIds,
          period_value: data.periodValue.toString(),
          period_type: data.periodType,
          active: 1,
        },
      };

      const response = await apiClient.post(ENDPOINTS.EMAIL_RULES, payload);
      
      // Save locally to persist on reload/UAT lag
      this.saveRuleLocally(data, response.data?.id?.toString() || response.data?.pms_email_rule_setup?.id?.toString());
      
      return response.data;
    } catch (error) {
      console.error('Error creating email rule:', error);
      throw error;
    }
  },

  // Update existing email rule
  async updateEmailRule(id: string, data: {
    ruleName: string;
    triggerType: string;
    triggerTo: string;
    roleIds: string[];
    periodValue: number;
    periodType: string;
  }, roleNames?: string): Promise<any> {
    try {
      const payload: CreateEmailRulePayload = {
        pms_email_rule_setup: {
          rule_name: data.ruleName,
          trigger_type: data.triggerType,
          trigger_to: data.triggerTo,
          role_ids: data.roleIds,
          period_value: data.periodValue.toString(),
          period_type: data.periodType,
          active: 1,
        },
      };

      const response = await apiClient.put(`${ENDPOINTS.EMAIL_RULES.replace('.json', '')}/${id}.json`, payload);
      
      // Update locally as well
      this.updateRuleLocally(id, { ...data, roleNames });
      
      return response.data;
    } catch (error) {
      console.error('Error updating email rule:', error);
      throw error;
    }
  }
};