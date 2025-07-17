import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import { EmailRule } from '@/types/emailRule';

interface ApiEmailRule {
  id: number;
  rule_name: string;
  trigger_type: 'PPM' | 'AMC';
  trigger_to: 'Supplier' | 'Occupant Admin' | 'Other';
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
};