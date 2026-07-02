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
} from "@/types/ceoDashboard";

const CEO_DASHBOARD_BASE_URL = localStorage.getItem("baseUrl")

export const fetchCeoDashboardOverallSummary = async (
  fromDate?: string,
  toDate?: string
): Promise<CeoDashboardSummaryBar> => {
  const token = getToken();

  const params: Record<string, string> = {};
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

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
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

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
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

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
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

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
  if (fromDate) params.from_date = fromDate;
  if (toDate) params.to_date = toDate;

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
