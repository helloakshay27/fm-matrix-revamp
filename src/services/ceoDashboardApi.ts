import axios from "axios";
import { getToken } from "@/utils/auth";
import type {
  CeoDashboardSummaryBar,
  CeoDashboardOverallSummaryResponse,
  CeoDashboardPortfolioHealth,
  CeoDashboardPortfolioHealthResponse,
  CeoDashboardProjectTypeClassification,
  CeoDashboardProjectTypeClassificationResponse,
  CeoDashboardProjectMatrix,
  CeoDashboardProjectMatrixResponse,
  CeoDashboardDepartmentHealthScorecard,
  CeoDashboardDepartmentHealthScorecardResponse,
  CeoDashboardSprintHealthDetailed,
  CeoDashboardSprintHealthDetailedResponse,
  CeoDashboardDeliveryAccountability,
  CeoDashboardDeliveryAccountabilityResponse,
  CeoDashboardProjectInactivityAlert,
  CeoDashboardProjectInactivityAlertResponse,
  CeoDashboardBacklogAndIssues,
  CeoDashboardBacklogAndIssuesResponse,
  CeoDashboardIssueResolution,
  CeoDashboardIssueResolutionResponse,
  CeoDashboardMomEffectiveness,
  CeoDashboardMomEffectivenessResponse,
  CeoDashboardEfficiencyOverview,
  CeoDashboardEfficiencyOverviewResponse,
  CeoDashboardPeopleAlerts,
  CeoDashboardPeopleAlertsResponse,
  CeoDashboardEffortAndOverdue,
  CeoDashboardEffortAndOverdueResponse,
  CeoDashboardPersonWiseAgeingMatrix,
  CeoDashboardPersonWiseAgeingMatrixResponse,
  CeoDashboardPerPersonBreakdown,
  CeoDashboardPerPersonBreakdownResponse,
} from "@/types/ceoDashboard";

const CEO_DASHBOARD_BASE_URL = localStorage.getItem("baseUrl")

export const fetchCeoDashboardOverallSummary = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardSummaryBar> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardOverallSummaryResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/overall_summary.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data.summary_bar;
};

export const fetchCeoDashboardPortfolioHealth = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardPortfolioHealth> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardPortfolioHealthResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/portfolio_health.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardProjectTypeClassification = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardProjectTypeClassification> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardProjectTypeClassificationResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/project_type_classification.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardProjectMatrix = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardProjectMatrix> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardProjectMatrixResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/project_matrix.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardDepartmentHealthScorecard = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardDepartmentHealthScorecard> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardDepartmentHealthScorecardResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/department_health_scorecard.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardSprintHealthDetailed = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardSprintHealthDetailed> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardSprintHealthDetailedResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/sprint_health_detailed.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardDeliveryAccountability = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardDeliveryAccountability> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardDeliveryAccountabilityResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/delivery_accountability.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardProjectInactivityAlert = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardProjectInactivityAlert> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardProjectInactivityAlertResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/project_inactivity_alert.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardBacklogAndIssues = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardBacklogAndIssues> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardBacklogAndIssuesResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/backlog_and_issues.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardIssueResolution = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardIssueResolution> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardIssueResolutionResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/issue_resolution.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardMomEffectiveness = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardMomEffectiveness> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardMomEffectivenessResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/mom_effectiveness.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardEfficiencyOverview = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardEfficiencyOverview> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardEfficiencyOverviewResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/efficiency_overview.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardPeopleAlerts = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardPeopleAlerts> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardPeopleAlertsResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/people_alerts.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardEffortAndOverdue = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardEffortAndOverdue> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardEffortAndOverdueResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/effort_and_overdue.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardPersonWiseAgeingMatrix = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardPersonWiseAgeingMatrix> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardPersonWiseAgeingMatrixResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/person_wise_ageing_matrix.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};

export const fetchCeoDashboardPerPersonBreakdown = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardPerPersonBreakdown> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.date_from = fromDate;
  if (toDate) params.date_to = toDate;

  const response = await axios.get<CeoDashboardPerPersonBreakdownResponse>(
    `https://${CEO_DASHBOARD_BASE_URL}/ceo_dashboard/per_person_breakdown.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );

  return response.data.data;
};
