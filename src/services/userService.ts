import axios from "axios";
import { authService } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

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
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(
        `?id=${encodeURIComponent(userId)}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to access this profile.");
      } else if (error.response?.status === 404) {
        throw new Error("Profile not found.");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        `?id=${encodeURIComponent(userId)}`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to update this profile.");
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || "Invalid request data.");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update user profile"
      );
    }
  }

  async changePassword(
    userId: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        `?id=${encodeURIComponent(userId)}&action=password`,
        { newPassword },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to change this password.");
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || "Invalid password.");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }

  async updatePreferences(
    userId: string,
    preferences: UpdatePreferencesData
  ): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        `?id=${encodeURIComponent(userId)}&action=preferences`,
        preferences,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to update preferences.");
      } else if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.error || "Invalid preferences data."
        );
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update preferences"
      );
    }
  }
}

export const userService = new UserService();
