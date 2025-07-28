
// Authentication utility functions
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  access_token: string;
  phone?: string;
}

export interface OTPResponse {
  success: boolean;
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
  USER: 'user',
  TOKEN: 'token',
  TEMP_PHONE: 'temp_phone',
  TEMP_EMAIL: 'temp_email',
  BASE_URL: 'base_url'
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
  
};

export const getOrganizationsByEmail = async (email: string): Promise<Organization[]> => {
  const response = await fetch(`https://uat.lockated.com/api/users/get_organizations_by_email.json?email=${email}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  
  const data = await response.json();
  return data.organizations || [];
};


export const loginUser = async (email: string, password: string, baseUrl: string): Promise<{ id: number; email: string; firstname: string; lastname: string; access_token: string }> => {
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
export const loginWithPhone = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API call for phone login
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Store temp phone for OTP verification
  localStorage.setItem(AUTH_KEYS.TEMP_PHONE, phone);
  
  // For now, simulate success - replace with actual API call
  return {
    success: true,
    message: 'OTP sent to your phone number'
  };
};

// Verify OTP after phone login
export const verifyOTP = async (otp: string): Promise<LoginResponse> => {
  const phone = localStorage.getItem(AUTH_KEYS.TEMP_PHONE);
  
  if (!phone) {
    throw new Error('Phone number not found');
  }

  // Simulate API call for OTP verification
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For development, accept "123456" as valid OTP
  if (otp === '123456') {
    // Clear temp phone
    localStorage.removeItem(AUTH_KEYS.TEMP_PHONE);
    
    // Return mock user data
    return {
      id: 1,
      email: 'user@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: phone,
      access_token: 'mock-jwt-token'
    };
  } else {
    throw new Error('Invalid OTP');
  }
};

// Send forgot password OTP
export const sendForgotPasswordOTP = async (emailOrPhone: string): Promise<OTPResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Store temp email/phone for password reset
  if (emailOrPhone.includes('@')) {
    localStorage.setItem(AUTH_KEYS.TEMP_EMAIL, emailOrPhone);
  } else {
    localStorage.setItem(AUTH_KEYS.TEMP_PHONE, emailOrPhone);
  }
  
  return {
    success: true,
    message: 'OTP sent successfully',
    otp: '123456' // For development
  };
};

// Verify forgot password OTP
export const verifyForgotPasswordOTP = async (otp: string): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (otp === '123456') {
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } else {
    throw new Error('Invalid OTP');
  }
};

// Reset password
export const resetPassword = async (newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Clear temp data
  localStorage.removeItem(AUTH_KEYS.TEMP_EMAIL);
  localStorage.removeItem(AUTH_KEYS.TEMP_PHONE);
  
  return {
    success: true,
    message: 'Password reset successfully'
  };
};
