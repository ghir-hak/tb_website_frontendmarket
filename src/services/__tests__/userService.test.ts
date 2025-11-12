import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock axios - must be before imports
vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  // Create a new instance for each test run
  const instance = {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  };
  return {
    ...actual,
    default: {
      ...(actual as any).default,
      create: vi.fn(() => instance),
      isAxiosError: vi.fn((error: any) => error?.isAxiosError === true),
    },
  };
});

// Mock authService
vi.mock("../authService", () => ({
  authService: {
    getAuthToken: vi.fn(),
  },
}));

// Import after mocks
import axios from "axios";
import { userService, UserServiceError } from "../userService";
import { authService } from "../authService";

describe("UserService", () => {
  const mockToken = "mock-token";
  const mockUserId = "user123";
  const mockUserProfile = {
    id: mockUserId,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    address: "123 Main St",
    preferences: {
      language: "en",
      notifications: true,
      displayMode: "light",
    },
    roles: ["buyer"],
  };

  // Get the instance from axios.create - call it to get the same instance
  const getMockInstance = () => {
    return (axios as any).create({});
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (authService.getAuthToken as any).mockReturnValue(mockToken);
    (axios.isAxiosError as any).mockImplementation(
      (error: any) => error?.isAxiosError === true
    );
  });

  describe("getUserProfile", () => {
    it("should successfully get user profile", async () => {
      const instance = getMockInstance();
      instance.get.mockResolvedValue({ data: mockUserProfile });

      const result = await userService.getUserProfile(mockUserId);

      expect(result).toEqual(mockUserProfile);
      expect(instance.get).toHaveBeenCalledWith(
        expect.stringContaining(`?id=${encodeURIComponent(mockUserId)}`),
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should throw UserServiceError on 401", async () => {
      const instance = getMockInstance();
      const error = {
        response: { status: 401 },
        isAxiosError: true,
      };
      instance.get.mockRejectedValue(error);

      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        UserServiceError
      );
      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        "Authentication failed"
      );
    });

    it("should throw UserServiceError on 403", async () => {
      const instance = getMockInstance();
      const error = {
        response: { status: 403 },
        isAxiosError: true,
      };
      instance.get.mockRejectedValue(error);

      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        UserServiceError
      );
      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        "permission"
      );
    });

    it("should throw UserServiceError when no token", async () => {
      (authService.getAuthToken as any).mockReturnValue(null);

      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        UserServiceError
      );
      await expect(userService.getUserProfile(mockUserId)).rejects.toThrow(
        "No authentication token"
      );
    });
  });

  describe("updateUserProfile", () => {
    const updateData = {
      name: "Jane Doe",
      email: "jane@example.com",
    };

    it("should successfully update user profile", async () => {
      const instance = getMockInstance();
      const updatedProfile = { ...mockUserProfile, ...updateData };
      instance.put.mockResolvedValue({ data: updatedProfile });

      const result = await userService.updateUserProfile(mockUserId, updateData);

      expect(result).toEqual(updatedProfile);
      expect(instance.put).toHaveBeenCalledWith(
        expect.stringContaining(`?id=${encodeURIComponent(mockUserId)}`),
        updateData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should throw UserServiceError on 400", async () => {
      const instance = getMockInstance();
      const error = {
        response: {
          status: 400,
          data: { error: "Invalid email format" },
        },
        isAxiosError: true,
      };
      instance.put.mockRejectedValue(error);

      await expect(
        userService.updateUserProfile(mockUserId, updateData)
      ).rejects.toThrow(UserServiceError);
    });
  });

  describe("changePassword", () => {
    const newPassword = "newpassword123";

    it("should successfully change password", async () => {
      const instance = getMockInstance();
      instance.post.mockResolvedValue({
        data: { message: "password changed successfully" },
      });

      const result = await userService.changePassword(mockUserId, newPassword);

      expect(result.message).toBe("password changed successfully");
      expect(instance.post).toHaveBeenCalledWith(
        expect.stringContaining(
          `?id=${encodeURIComponent(mockUserId)}&action=password`
        ),
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should throw UserServiceError on failure", async () => {
      const instance = getMockInstance();
      const error = {
        response: {
          status: 400,
          data: { error: "Password too short" },
        },
        isAxiosError: true,
      };
      instance.post.mockRejectedValue(error);

      await expect(
        userService.changePassword(mockUserId, newPassword)
      ).rejects.toThrow(UserServiceError);
    });
  });

  describe("updatePreferences", () => {
    const preferences = {
      language: "fr",
      displayMode: "dark",
      notifications: false,
    };

    it("should successfully update preferences", async () => {
      const instance = getMockInstance();
      const updatedProfile = {
        ...mockUserProfile,
        preferences: { ...mockUserProfile.preferences, ...preferences },
      };
      instance.put.mockResolvedValue({ data: updatedProfile });

      const result = await userService.updatePreferences(
        mockUserId,
        preferences
      );

      expect(result.preferences).toMatchObject(preferences);
      expect(instance.put).toHaveBeenCalledWith(
        expect.stringContaining(
          `?id=${encodeURIComponent(mockUserId)}&action=preferences`
        ),
        preferences,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should throw UserServiceError on failure", async () => {
      const instance = getMockInstance();
      const error = {
        response: {
          status: 400,
          data: { error: "Invalid display mode" },
        },
        isAxiosError: true,
      };
      instance.put.mockRejectedValue(error);

      await expect(
        userService.updatePreferences(mockUserId, preferences)
      ).rejects.toThrow(UserServiceError);
    });
  });
});
