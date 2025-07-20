
// Authentication utility functions
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Organization {
  id: number;
  name: string;
  active: boolean;
  domain: string;
  sub_domain: string;
  logo?: {
    url: string;
  };
}

export interface Company {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  name: string;
  company_id?: number;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  access_token: string;
  [key: string]: any; // Allow for additional fields from API response
}

// Local storage keys
export const AUTH_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  BASE_URL: 'baseUrl',
  LOGIN_RESPONSE: 'loginResponse',
  SELECTED_ORGANIZATION: 'selectedOrganization',
  SELECTED_COMPANY: 'selectedCompany',
  SELECTED_SITE: 'selectedSite'
} as const;

// Save user data to localStorage
export const saveUser = (user: User): void => {
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
};

// Get user data from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(AUTH_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Save auth token to localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);
};

// Get auth token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
};

// Save base URL to localStorage
export const saveBaseUrl = (baseUrl: string): void => {
  localStorage.setItem(AUTH_KEYS.BASE_URL, baseUrl);
};

// Get base URL from localStorage
export const getBaseUrl = (): string | null => {
  const savedUrl = localStorage.getItem(AUTH_KEYS.BASE_URL);
  if (!savedUrl) return null;
  
  // Ensure the URL includes the protocol
  return savedUrl.startsWith('http') ? savedUrl : `https://${savedUrl}`;
};

// Save complete login response to localStorage
export const saveLoginResponse = (response: LoginResponse): void => {
  localStorage.setItem(AUTH_KEYS.LOGIN_RESPONSE, JSON.stringify(response));
};

// Get complete login response from localStorage
export const getLoginResponse = (): LoginResponse | null => {
  const responseStr = localStorage.getItem(AUTH_KEYS.LOGIN_RESPONSE);
  return responseStr ? JSON.parse(responseStr) : null;
};

// Save selected organization to localStorage
export const saveSelectedOrganization = (organization: Organization): void => {
  localStorage.setItem(AUTH_KEYS.SELECTED_ORGANIZATION, JSON.stringify(organization));
};

// Get selected organization from localStorage
export const getSelectedOrganization = (): Organization | null => {
  const orgStr = localStorage.getItem(AUTH_KEYS.SELECTED_ORGANIZATION);
  return orgStr ? JSON.parse(orgStr) : null;
};

// Save selected company to localStorage
export const saveSelectedCompany = (company: Company): void => {
  localStorage.setItem(AUTH_KEYS.SELECTED_COMPANY, JSON.stringify(company));
};

// Get selected company from localStorage
export const getSelectedCompany = (): Company | null => {
  const companyStr = localStorage.getItem(AUTH_KEYS.SELECTED_COMPANY);
  return companyStr ? JSON.parse(companyStr) : null;
};

// Save selected site to localStorage
export const saveSelectedSite = (site: Site): void => {
  localStorage.setItem(AUTH_KEYS.SELECTED_SITE, JSON.stringify(site));
};

// Get selected site from localStorage
export const getSelectedSite = (): Site | null => {
  const siteStr = localStorage.getItem(AUTH_KEYS.SELECTED_SITE);
  return siteStr ? JSON.parse(siteStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getUser();
  const token = getToken();
  return !!(user && token);
};

// Clear all auth data
export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.BASE_URL);
  localStorage.removeItem(AUTH_KEYS.LOGIN_RESPONSE);
  localStorage.removeItem(AUTH_KEYS.SELECTED_ORGANIZATION);
  localStorage.removeItem(AUTH_KEYS.SELECTED_COMPANY);
  localStorage.removeItem(AUTH_KEYS.SELECTED_SITE);
};

// Get organizations by email
export const getOrganizationsByEmail = async (email: string): Promise<Organization[]> => {
  const response = await fetch(`https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  
  const data = await response.json();
  return data.organizations || [];
};

// Login with email and password
export const loginUser = async (email: string, password: string, baseUrl: string): Promise<LoginResponse> => {
  const response = await fetch(`https://${baseUrl}/api/users/sign_in.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data;
};
