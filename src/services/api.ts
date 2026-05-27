import axios from 'axios';
import { Platform } from 'react-native';

const API_PORT = 3000;
const LAN_API_HOST = '192.168.1.133';

export const BASE_URL = Platform.select({
  ios: `http://localhost:${API_PORT}`,
  android: `http://10.0.2.2:${API_PORT}`,
  default: `http://${LAN_API_HOST}:${API_PORT}`,
});
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection and try again.';
/**
 * Represents the authenticated user's core profile data.
 */
export interface User {
  id: string;
  full_name: string;
  email: string;
  name?: string; // Legacy support field
  initials?: string;
}

/**
 * Represents a role within an institute (e.g., Admin, Student, Teacher).
 */
export interface Role {
  role_id: number;
  role_name: string;
  id?: string; // Compatibility field
  name?: string; // Compatibility field
  description?: string;
  accentColor?: string;
  icon?: string;
}

/**
 * Represents an educational institute containing multiple roles.
 */
export interface Institute {
  institute_id: number;
  institute_name: string;
  location: string;
  roles: Role[];
  logo?: string; // Correct field name for backend logo URL
  city?: string; // Compatibility field
  state?: string; // Compatibility field
  logo_url?: string;
  isVerified?: boolean; // Compatibility field
  id?: string; // Standardized ID fallback
  name?: string; // Standardized Name fallback
  institute_type?: string; // e.g. "School", "College", "University"
}

/**
 * API response structure for the login endpoint.
 */
export interface AuthLoginResponse {
  success: boolean;
  data: {
    token: string;
    pre_context_token?: string;
    user: User;
  };
}

/**
 * API response structure for fetching the user's contextual data (institutes/roles).
 */
export interface UserContextResponse {
  success: boolean;
  data: Institute[];
}

// Create an axios instance with a 10-second timeout for Render cold starts
// In your api service file:
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increase to 30 seconds to give the server more time
  headers: {
    "Content-Type": "application/json"
  }
});

const getApiErrorMessage = (error: any, fallback: string) => {
  if (error.response) {
    return error.response.data?.message || fallback;
  }

  if (error.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.';
  }

  if (error.request || error.message?.includes('Network request failed')) {
    return NETWORK_ERROR_MESSAGE;
  }

  return error.message || fallback;
};

/**
 * Centralized API Service object containing all endpoint methods.
 */
export const api = {
  /**
   * STEP 1: Authenticate the user with email and password.
   * Retrieves the JWT authentication token and basic user profile.
   * 
   * @param email The user's email address
   * @param password The user's password
   * @returns Promise resolving to the authentication response containing the token
   */
  login: async (email: string, password: string): Promise<AuthLoginResponse> => {
    console.log('--- LOGIN REQUEST ---');
    console.log('URL:', `${BASE_URL}/auth/login`);
    console.log('BODY:', { email, password });

    try {
      const response = await apiClient.post<AuthLoginResponse>('/auth/login', { email, password });
      console.log("SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("ERROR:", error.message);
      console.log("FULL ERROR:", error);
      throw new Error(getApiErrorMessage(error, 'Invalid login credentials or no working endpoint'));
    }
  },

  /**
   * STEP 2: Fetch the user's full context (accessible institutes and roles) using the Bearer token.
   * This is required because users can have different roles across multiple institutes.
   * 
   * @param token The JWT authentication token obtained from the login step
   * @returns Promise resolving to an array of Institutes, each containing a list of assigned Roles
   */
  getMyInstitutesRoles: async (token: string): Promise<UserContextResponse> => {
    console.log('--- CONTEXT REQUEST ---');
    console.log('URL:', `${BASE_URL}/auth/my-institutes-roles`);
    console.log('AUTH: Bearer', token.substring(0, 10) + '...');

    try {
      const response = await apiClient.get<UserContextResponse>('/auth/my-institutes-roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("SUCCESS:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("ERROR:", error.message);
      console.log("FULL ERROR:", error);
      throw new Error(getApiErrorMessage(error, 'Failed to fetch user context'));
    }
  },
};
