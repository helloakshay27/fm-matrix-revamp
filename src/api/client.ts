import { saveToken, clearAuth } from "@/utils/auth";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://helpdesk-api.lockated.com/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Attach JWT from in-memory store on every request
apiClient.interceptors.request.use((config) => {
  const token = getTokenFromStore();
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, refresh token and reload
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        const orgId = "251bd048-e5db-485e-8e4b-6915849124d3";

        const payload = {
          email: user.email || '',
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User',
          role: 'platform_admin',
          organisation_id: orgId,
          lockated_id: user.id || ''
        };

        const response = await axios.post(
          'https://helpdesk-api.lockated.com/api/v1/auth/find_or_create',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Integration-Key': 'afa01bab9233764566c75933940fb07ecd299f6c0d3cce5fd08d59cf8dcc176b'
            }
          }
        );

        const newToken = response.data?.token;
        if (newToken) {
          localStorage.setItem('mail_token', newToken);
          window.location.reload();
          return new Promise(() => { }); // Stop further execution while reloading
        }
      } catch (refreshError) {
        console.error('Auth refresh failed:', refreshError);
      }
    }
    return Promise.reject(error);
  },
);

// In-memory token storage, seeded from Zustand's persisted localStorage on demand.
let _token: string | null = null;

function getTokenFromStore(): string | null {
  if (_token) return _token;

  // On page load, _token is null until Zustand rehydrates. Read directly from
  // localStorage so requests don't fire without a token and trigger a 401 redirect.
  try {
    const raw = localStorage.getItem('mail_token');
    return raw
  } catch {
    // ignore parse errors
  }

  return null;
}

export const setToken = (token: string): void => {
  localStorage.setItem('mail_token', token);
};

export const clearTokenFromStore = (): void => {
  localStorage.removeItem('mail_token');
};
