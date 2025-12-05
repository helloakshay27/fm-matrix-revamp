// Authentication utility functions
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobile?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  spree_api_key?: string;
  access_token?: string;
  number_verified?: number;
  lock_role?: {
    id: number;
    name: string;
    display_name: string;
    access_level: any;
    access_to: any;
    company_id: number;
    active: number;
    created_at: string;
    updated_at: string;
    permissions_hash: string;
    user_id: number;
    phases: any;
    modules: string[];
    role_for: string;
  };
  user_type?: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  access_token: string;
  mobile?: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  spree_api_key?: string;
  number_verified?: number;
  lock_role?: {
    id: number;
    name: string;
    display_name: string;
    access_level: any;
    access_to: any;
    company_id: number;
    active: number;
    created_at: string;
    updated_at: string;
    permissions_hash: string;
    user_id: number;
    phases: any;
    modules: string[];
    role_for: string;
  };
}

export interface OTPResponse {
  code: number;
  message: string;
  otp?: string; // For development/testing
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
  USER: "user",
  TOKEN: "token",
  TEMP_PHONE: "temp_phone",
  TEMP_EMAIL: "temp_email",
  BASE_URL: "baseUrl",
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
  return savedUrl.startsWith("http") ? savedUrl : `https://${savedUrl}`;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getUser();
  const token = getToken();
  return !!(user && token);
};

// Clear all auth data

// Clear all auth data
export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.TEMP_PHONE);
  localStorage.removeItem(AUTH_KEYS.TEMP_EMAIL);
  localStorage.removeItem(AUTH_KEYS.BASE_URL);
  localStorage.clear();
};
const hostname = window.location.hostname;

const isOmanSite = hostname.includes("oig.gophygital.work");
const isViSite =
  hostname.includes("vi-web.gophygital.work") ||
  hostname.includes("web.gophygital.work");

const isFmSite =
  hostname.includes("fm-uat.gophygital.work") ||
  hostname.includes("fm.gophygital.work");

export const getOrganizationsByEmail = async (
  email: string
): Promise<Organization[]> => {
  if (isOmanSite || isFmSite) {
    const response = await fetch(
      `https://club-uat-api.lockated.com/api/users/get_organizations_by_email.json?email=${email}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }

    const data = await response.json();
    return data.organizations || [];
  }

  if (isViSite) {
    const response = await fetch(
      `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?email=${email}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }

    const data = await response.json();
    return data.organizations || [];
  }

  // Default fallback for other sites
  const response = await fetch(
    `https://club-uat-api.lockated.com/api/users/get_organizations_by_email.json?email=${email}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }

  const data = await response.json();
  return data.organizations || [];
};

export const loginUser = async (
  email: string,
  password: string,
  baseUrl: string,
  organizationId?: number
): Promise<User> => {
  // Build request body
  const requestBody: any = {
    email,
    password,
  };

  // Add organization_id if provided
  if (organizationId) {
    requestBody.organization_id = organizationId;
  }

  const response = await fetch(`https://${baseUrl}/api/users/sign_in.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    // Try to get error details from response
    let errorMessage = "Login failed";
    let errorData = null;

    try {
      errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || "Login failed";
    }

    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const data = await response.json();
  return data;
};

// Login with email and password
// export const loginWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
//   const response = await fetch('https://fm-uat-api.lockated.com/api/users/sign_in.json', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       email,
//       password
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Login failed');
//   }

//   const data = await response.json();
//   return data;
// };

// Login with phone and password (first step)
export const loginWithPhone = async (
  phone: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate API call for phone login
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Store temp phone for OTP verification
  localStorage.setItem(AUTH_KEYS.TEMP_PHONE, phone);

  // For now, simulate success - replace with actual API call
  return {
    success: true,
    message: "OTP sent to your phone number",
  };
};

// Verify OTP after phone login
export const verifyOTP = async (otp: string): Promise<LoginResponse> => {
  const email = localStorage.getItem("temp_email");
  const otptoken = localStorage.getItem("temp_token");
  const baseUrl = getBaseUrl();
  // const token = getToken();




  if (!email) {
    throw new Error("Session expired. Please login again to receive a new OTP.");
  }

  if (!baseUrl) {
    throw new Error("Base URL not found. Please login again.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add Bearer token if available
  if (otptoken) {
    headers["Authorization"] = `Bearer ${otptoken}`;
  }

  const response = await fetch(
    `https://live-api.gophygital.work/verify_code.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: email,
        otp: otp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("OTP verification failed");
  }

  const data = await response.json();

  // Only clear temp email after successful verification
  // Check if the response indicates success (you might need to adjust this based on your API response structure)
  if (data && (data.access_token || data.id)) {
    localStorage.removeItem("temp_email");
    localStorage.removeItem("temp_token");
  }

  return data;
};

// Send forgot password OTP
export const sendForgotPasswordOTP = async (
  emailOrMobile: string
): Promise<OTPResponse> => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("Base URL not configured");
  }

  // Determine if input is email or mobile
  const isEmail = emailOrMobile.includes("@");
  const requestBody: any = {
    request_otp: 1,
  };

  if (isEmail) {
    requestBody.mobile = emailOrMobile;
    // Store temp email for password reset
    localStorage.setItem(AUTH_KEYS.TEMP_EMAIL, emailOrMobile);
  } else {
    requestBody.mobile = emailOrMobile;
    // Store temp mobile for password reset
    localStorage.setItem(AUTH_KEYS.TEMP_PHONE, emailOrMobile);
  }

  const response = await fetch(
    `${baseUrl}/api/users/forgot_password_otp.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send OTP");
  }

  const data = await response.json();

  return data;
};

// Verify forgot password OTP and reset password
export const verifyForgotPasswordOTPAndResetPassword = async (
  emailOrMobile: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("Base URL not configured");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Determine if input is email or mobile
  const isEmail = emailOrMobile.includes("@");
  const requestBody: any = {
    verify_otp: 1,
    otp: otp,
    newpassword: newPassword,
    newpassword_confirm: confirmPassword,
  };

  if (isEmail) {
    requestBody.mobile = emailOrMobile;
  } else {
    requestBody.mobile = emailOrMobile;
  }

  const response = await fetch(
    `${baseUrl}/api/users/forgot_password_otp.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  const data = await response.json();

  // Clear temp data
  localStorage.removeItem(AUTH_KEYS.TEMP_EMAIL);
  localStorage.removeItem(AUTH_KEYS.TEMP_PHONE);

  return {
    success: true,
    message: data.message || "Password reset successfully",
  };
};

// Verify forgot password OTP (kept for backward compatibility)
export const verifyForgotPasswordOTP = async (
  otp: string
): Promise<{ success: boolean; message: string }> => {
  // This function is now mainly for validation, actual reset happens in the combined function above
  if (!otp) {
    throw new Error("OTP is required");
  }

  return {
    success: true,
    message: "OTP verified successfully",
  };
};

// Reset password (kept for backward compatibility)
export const resetPassword = async (
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  return {
    success: true,
    message: "Password validation successful",
  };
};

// Get organizations by email and auto-select based on orgId
export const getOrganizationsByEmailAndAutoSelect = async (
  email: string,
  orgId?: string
): Promise<{ organizations: Organization[]; selectedOrg: Organization | null }> => {
  const hostname = window.location.hostname;

  const isOmanSite = hostname.includes("oig.gophygital.work");
  const isViSite =
    hostname.includes("vi-web.gophygital.work") ||
    hostname.includes("web.gophygital.work");
  const isFmSite =
    hostname.includes("fm-uat.gophygital.work") ||
    hostname.includes("fm.gophygital.work");

  let apiUrl = "";

  if (isOmanSite || isFmSite) {
    apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
  } else if (isViSite) {
    apiUrl = `https://live-api.gophygital.work/api/users/get_organizations_by_email.json?email=${email}`;
  } else {
    // Default fallback
    apiUrl = `https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`;
  }

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }

  const data = await response.json();
  const organizations = data.organizations || [];

  // Auto-select organization if orgId is provided
  let selectedOrg: Organization | null = null;
  if (orgId) {
    const orgIdNum = parseInt(orgId, 10);
    selectedOrg = organizations.find((org: Organization) => org.id === orgIdNum) || null;
  }

  return { organizations, selectedOrg };
};
