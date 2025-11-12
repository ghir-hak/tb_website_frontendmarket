import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}

export interface DeleteResponse {
  message: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
}

class AuthService {
  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  private removeToken(): void {
    localStorage.removeItem("token");
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/register", data);
      // Registration doesn't return a token, so we need to login after registration
      // Auto-login the user after successful registration
      try {
        const loginResponse = await this.login({
          username: data.username,
          password: data.password,
        });
        // User ID is already stored in login method
        return response.data;
      } catch (loginError) {
        // If auto-login fails, store user ID from registration response
        if (response.data.id) {
          localStorage.setItem("userId", response.data.id);
        }
        // The user can manually login
        console.warn("Auto-login after registration failed:", loginError);
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/login", data);
      if (response.data.token) {
        this.setToken(response.data.token);
        // Store user ID for easy access
        if (response.data.user?.id) {
          localStorage.setItem("userId", response.data.user.id);
        }
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async getUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await api.get<User>("/getuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get user");
    }
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await api.put<User>("/updateuser", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  }

  async deleteUser(): Promise<DeleteResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await api.delete<DeleteResponse>("/deleteuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.logout();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  }

  logout(): void {
    this.removeToken();
    localStorage.removeItem("userId");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  getUserId(): string | null {
    return localStorage.getItem("userId");
  }
}

export const authService = new AuthService();
