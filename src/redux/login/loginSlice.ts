import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../createApiSlice";
import { Company, Site } from "@/components/Header";

export interface CompanyListResponse {
    code: number;
    message: string;
    companies: Company[];
    selected_company?: Company;
}

export interface SiteListResponse {
    code: number;
    message: string;
    sites: Site[];
    selected_site?: Site;
}

export const oaganizationsByEmail = createAsyncThunk(
    "oaganizationsByEmail",
    async ({ email }: { email: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://club-uat-api.lockated.com/api/users/get_organizations_by_email.json?email=${email}`
            );
            return response.data.organizations;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch organizations";
            return rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    "login",
    async (
        {
            baseUrl,
            email,
            password,
        }: { baseUrl: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/api/users/sign_in.json`,
                {
                    email,
                    password,
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Failed to Login";
            return rejectWithValue(message);
        }
    }
);

export const fetchCompanyList = createAsyncThunk(
    "fetchCompanyList",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/allowed_companies.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Store selected company in localStorage if available
            if (response.data.selected_company) {
                localStorage.setItem('selected_company', JSON.stringify(response.data.selected_company));
                localStorage.setItem('selected_company_id', response.data.selected_company.id.toString());

                // Also update the user's company_id in localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.company_id = response.data.selected_company.id;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch company list";
            return rejectWithValue(message);
        }
    }
);

export const changeCompany = createAsyncThunk(
    "changeCompany",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/change_company.json?company_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Store the newly selected company in localStorage
            if (response.data.selected_company) {
                localStorage.setItem('selected_company', JSON.stringify(response.data.selected_company));
                localStorage.setItem('selected_company_id', response.data.selected_company.id.toString());

                // Also update the user's company_id in localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.company_id = response.data.selected_company.id;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } else {
                // If selected_company is not in response, store the id that was changed to
                localStorage.setItem('selected_company_id', id.toString());

                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.company_id = id;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to change company";
            return rejectWithValue(message);
        }
    }
);

export const fetchSiteList = createAsyncThunk(
    "fetchSiteList",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string, id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/sites/allowed_sites.json?user_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch sites";
            return rejectWithValue(message);
        }
    }
);

export const changeSite = createAsyncThunk(
    "changeSite",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string, id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/change_site.json?site_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch sites";
            return rejectWithValue(message);
        }
    }
)

export const oaganizationsByEmailSlice = createApiSlice(
    "oaganizationsByEmail",
    oaganizationsByEmail
);
export const loginSlice = createApiSlice("login", login);
export const fetchCompanyListSlice = createApiSlice<CompanyListResponse>(
    "fetchCompanyList",
    fetchCompanyList
);
export const changeCompanySlice = createApiSlice(
    "changeCompany",
    changeCompany
);
export const fetchSiteListSlice = createApiSlice<SiteListResponse>(
    "fetchSiteList",
    fetchSiteList
);
export const changeSiteSlice = createApiSlice(
    "changeSite",
    changeSite
);

export const oaganizationsByEmailReducer = oaganizationsByEmailSlice.reducer;
export const loginReducer = loginSlice.reducer;
export const fetchCompanyListReducer = fetchCompanyListSlice.reducer;
export const changeCompanyReducer = changeCompanySlice.reducer;
export const fetchSiteListReducer = fetchSiteListSlice.reducer;
export const changeSiteReducer = changeSiteSlice.reducer;
