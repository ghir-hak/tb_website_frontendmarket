import axios, { AxiosError } from "axios";
import { authService } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Types matching backend models
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
  displayMode?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
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
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Request failed";
      throw new Error(message);
    }
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred");
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(
        `${API_BASE_URL}/api/users?id=${encodeURIComponent(userId)}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        `${API_BASE_URL}/api/users?id=${encodeURIComponent(userId)}`,
        data,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        `${API_BASE_URL}/api/users?id=${encodeURIComponent(
          userId
        )}&action=password`,
        { newPassword },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePreferences(
    userId: string,
    preferences: UpdatePreferencesData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        `${API_BASE_URL}/api/users?id=${encodeURIComponent(
          userId
        )}&action=preferences`,
        preferences,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const userService = new UserService();
