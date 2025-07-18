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

// Local storage keys
export const AUTH_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  BASE_URL: 'baseUrl'
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
  return localStorage.getItem(AUTH_KEYS.BASE_URL);
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
export const loginUser = async (email: string, password: string, baseUrl: string): Promise<{ user: User; access_token: string }> => {
  const response = await fetch(`https://${baseUrl}/api/users/sign_in.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email,
        password
      }
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data;
};