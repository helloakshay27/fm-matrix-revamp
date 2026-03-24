import { apiClient } from "@/utils/apiClient";

// ─── Response Interfaces ──────────────────────────────────────────────────────

export interface TopEmployee {
  rank: number;
  firstname: string;
  lastname: string;
  company_name: string | null;
  steps: number;
}

export interface TopEmployeeInCompany {
  rank: number;
  firstname: string;
  lastname: string;
  steps: number;
}

export interface TopCompanyInOfficePark {
  rank: number;
  company_name: string | null;
  steps: number;
}

export interface TopCompany {
  rank: number;
  company_name: string | null;
  steps: number;
}

export interface TopOfficePark {
  rank: number;
  site_name: string;
  steps: number;
}

export interface GenderWiseParticipant {
  gender: string;
  user_count: number;
}

export interface GenderWiseParticipantsResponse {
  data: GenderWiseParticipant[];
  total: number;
  start_date: string;
  end_date: string;
}

export interface SiteWiseAchiever {
  rank: number;
  site_id: number;
  site_name: string;
  user_count: number;
}

export interface SiteWiseAchieversResponse {
  data: SiteWiseAchiever[];
  start_date: string;
  end_date: string;
}

export interface TopSite {
  rank: number;
  site_id: number;
  site_name: string;
  total_steps: number;
  average_steps: number;
  user_count: number;
}

export interface Top10SitesResponse {
  data: TopSite[];
  start_date: string;
  end_date: string;
}

export interface OrganisationDailyStepCount {
  total_steps: number;
  user_count: number;
  date: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const stepathonAPI = {
  async getTopEmployees(
    startDate: string,
    endDate: string
  ): Promise<{ top_employees: TopEmployee[] }> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_employees_scoreboards.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getTopEmployeesInCompany(
    startDate: string,
    endDate: string
  ): Promise<{ top_employees_in_company: TopEmployeeInCompany[] }> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_employees_in_company_scoreboards.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getTopCompaniesInOfficePark(
    startDate: string,
    endDate: string
  ): Promise<{ top_companies_in_office_park: TopCompanyInOfficePark[] }> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_companies_in_office_park_scoreboards.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getTopCompanies(
    startDate: string,
    endDate: string
  ): Promise<{ top_companies: TopCompany[] }> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_companies_scoreboards.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getTopOfficeParks(
    startDate: string,
    endDate: string
  ): Promise<{ top_office_parks: TopOfficePark[] }> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_office_parks_scoreboards.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getGenderWiseParticipants(
    startDate: string,
    endDate: string
  ): Promise<GenderWiseParticipantsResponse> {
    const resp = await apiClient.get(
      `/user_daily_goals/gender_wise_participants.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getSiteWiseAchievers(
    startDate: string,
    endDate: string
  ): Promise<SiteWiseAchieversResponse> {
    const resp = await apiClient.get(
      `/user_daily_goals/site_wise_achievers.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getTop10Sites(
    startDate: string,
    endDate: string
  ): Promise<Top10SitesResponse> {
    const resp = await apiClient.get(
      `/user_daily_goals/top_10_sites.json?start_date=${startDate}&end_date=${endDate}`
    );
    return resp.data;
  },

  async getOrganisationDailyStepCount(
    date: string
  ): Promise<OrganisationDailyStepCount> {
    const resp = await apiClient.get(
      `/user_daily_goals/organisation_daily_step_count.json?date=${date}`
    );
    return resp.data;
  },
};

export default stepathonAPI;
