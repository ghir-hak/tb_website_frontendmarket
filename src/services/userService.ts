import axios, { AxiosError } from "axios";
import { authService } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

// Create axios instance WITHOUT baseURL to avoid trailing slash issues
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to build full URL
const buildUrl = (queryString: string): string => {
  return `${API_BASE_URL}/api/users${queryString}`;
};

// Error types
export class UserServiceError extends Error {
  statusCode?: number;
  originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = "UserServiceError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// Helper to extract error message from axios error
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Helper to handle API errors with proper error messages
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    const statusCode = axiosError.response?.status;

    switch (statusCode) {
      case 401:
        throw new UserServiceError(
          "Authentication failed. Please login again.",
          401,
          error
        );
      case 403:
        throw new UserServiceError(
          "You don't have permission to perform this action.",
          403,
          error
        );
      case 400:
        throw new UserServiceError(
          extractErrorMessage(error) || "Invalid request data.",
          400,
          error
        );
      case 404:
        throw new UserServiceError(
          extractErrorMessage(error) || "Resource not found.",
          404,
          error
        );
      default:
        throw new UserServiceError(
          extractErrorMessage(error) || defaultMessage,
          statusCode,
          error
        );
    }
  }
  throw new UserServiceError(
    extractErrorMessage(error) || defaultMessage,
    undefined,
    error
  );
};

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferences: Preferences;
  roles: string[];
}

export interface Preferences {
  language?: string;
  notifications?: boolean;
  displayMode?: string; // "light" or "dark"
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordData {
  newPassword: string;
}

export interface UpdatePreferencesData {
  language?: string;
  notifications?: boolean;
  displayMode?: string;
}

class UserService {
  private getAuthHeaders() {
    const token = authService.getAuthToken();
    if (!token) {
      throw new UserServiceError("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(
        buildUrl(`?id=${encodeURIComponent(userId)}`),
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to get user profile");
      throw error; // This will never be reached, but satisfies TypeScript
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        buildUrl(`?id=${encodeURIComponent(userId)}`),
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update user profile");
      throw error; // This will never be reached, but satisfies TypeScript
    }
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        buildUrl(`?id=${encodeURIComponent(userId)}&action=password`),
        { newPassword },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to change password");
      throw error; // This will never be reached, but satisfies TypeScript
    }
  }

  async updatePreferences(
    userId: string,
    preferences: UpdatePreferencesData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        buildUrl(`?id=${encodeURIComponent(userId)}&action=preferences`),
        preferences,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update preferences");
      throw error; // This will never be reached, but satisfies TypeScript
    }
  }
}

export const userService = new UserService();
