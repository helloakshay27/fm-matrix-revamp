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

export const emailRuleService = {
  async getEmailRules(): Promise<EmailRule[]> {
    try {
      const response = await apiClient.get<ApiEmailRule[]>(ENDPOINTS.EMAIL_RULES);
      return response.data.map((rule, index) => mapApiResponseToEmailRule(rule, index));
    } catch (error) {
      console.error('Failed to fetch email rules:', error);
      throw error;
    }
  },

  // Create new email rule
  async createEmailRule(data: {
    ruleName: string;
    triggerType: string;
    triggerTo: string;
    roleIds: string[];
    periodValue: number;
    periodType: string;
  }): Promise<any> {
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
  }): Promise<any> {
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
      return response.data;
    } catch (error) {
      console.error('Error updating email rule:', error);
      throw error;
    }
  }
};