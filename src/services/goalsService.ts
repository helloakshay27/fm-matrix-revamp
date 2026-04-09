import axios from "axios";

export interface Goal {
  id: number;
  title: string;
  description: string;
  target_value: string;
  current_value: string;
  revenue_target: string | null;
  profit_target: string | null;
  unit: string;
  period: string;
  period_label: string;
  status: string;
  status_label: string;
  target_date: string | null;
  owner_id: number;
  owner_name: string;
  created_by_id: number;
  created_by_name: string;
  updated_by_id: number;
  updated_by_name: string;
  resource_id: number;
  resource_type: string;
  key_initiative_goals: any[];
  progress_percentage: number;
  update_remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalsDashboard {
  total_goals: number;
  not_started: number;
  on_track: number;
  achieved: number;
  behind: number;
}

export interface GoalsResponse {
  dashboard: GoalsDashboard;
  goals: Goal[];
}

export interface KRAEvaluationScores {
  process_discipline_score?: number;
  learning_innovation_score?: number;
  goal_clarity_alignment_score?: number;
  reliability_consistency_score?: number;
  client_stakeholder_focus_score?: number;
  ownership_accountability_score?: number;
  collaboration_communication_score?: number;
  growth_sales_score?: number;
  leadership_team_score?: number;
  personal_growth_score?: number;
  vision_strategy_score?: number;
  financial_health_score?: number;
  systems_processes_score?: number;
  innovation_technology_score?: number;
}

export interface KRAEvaluation {
  id: number;
  evaluation_type: "team" | "md";
  evaluation_date: string;
  total_score: number;
  scores: KRAEvaluationScores;
  notes: string;
  category: "average" | "good" | "excellent";
  created_at: string;
  updated_at: string;
}

export const fetchGoals = async (): Promise<GoalsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
    const protocol = baseUrl.startsWith("http") ? "" : "https://";
    
    const response = await axios.get(
      `${protocol}${baseUrl}/goals.json`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    throw error;
  }
};

export const fetchKRAs = async (email: string): Promise<KRAEvaluation[]> => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await axios.get(
      `https://life-api.lockated.com/kra_evaluations/by_email?email=${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch KRAs:", error);
    throw error;
  }
};
