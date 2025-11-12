<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-2xl font-light text-gray-900">Profile</h1>
          </div>
          <button
            @click="router.push('/dashboard')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Profile Information Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-light text-gray-900 mb-6">Profile Information</h2>

          <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-600 text-sm">{{ success }}</p>
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                v-model="profileForm.address"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Enter your address"
              ></textarea>
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!saving">Save Changes</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Preferences Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-light text-gray-900 mb-6">Preferences</h2>

          <form @submit.prevent="handleUpdatePreferences" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  v-model="preferencesForm.language"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label for="displayMode" class="block text-sm font-medium text-gray-700 mb-2">
                  Display Mode
                </label>
                <select
                  id="displayMode"
                  v-model="preferencesForm.displayMode"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div>
              <label class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  v-model="preferencesForm.notifications"
                  class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-800"
                />
                <span class="text-sm font-medium text-gray-700">Enable Notifications</span>
              </label>
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="savingPreferences"
                class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!savingPreferences">Save Preferences</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-light text-gray-900 mb-6">Change Password</h2>

          <form @submit.prevent="handleChangePassword" class="space-y-5">
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                placeholder="Enter new password"
              />
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="changingPassword"
                class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!changingPassword">Change Password</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { userService, type UserProfile } from '../services/userService';

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const savingPreferences = ref(false);
const changingPassword = ref(false);
const error = ref('');
const success = ref('');
const userId = ref<string | null>(null);
const profile = ref<UserProfile | null>(null);

const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
});

const preferencesForm = ref({
  language: 'en',
  displayMode: 'light',
  notifications: true,
});

const passwordForm = ref({
  newPassword: '',
});

onMounted(async () => {
  userId.value = authService.getUserId();
  
  if (!userId.value) {
    error.value = 'User ID not found. Please login again.';
    loading.value = false;
    return;
  }

  if (!authService.isAuthenticated()) {
    router.push('/auth');
    return;
  }

  try {
    profile.value = await userService.getUserProfile(userId.value);
    profileForm.value = {
      name: profile.value.name || '',
      email: profile.value.email || '',
      phone: profile.value.phone || '',
      address: profile.value.address || '',
    };
    preferencesForm.value = {
      language: profile.value.preferences?.language || 'en',
      displayMode: profile.value.preferences?.displayMode || 'light',
      notifications: profile.value.preferences?.notifications ?? true,
    };
  } catch (err: any) {
    error.value = err.message || 'Failed to load profile. Please try again.';
  } finally {
    loading.value = false;
  }
});

const handleUpdateProfile = async () => {
  if (!userId.value) return;

  saving.value = true;
  error.value = '';
  success.value = '';

  try {
    profile.value = await userService.updateUserProfile(userId.value, {
      name: profileForm.value.name.trim(),
      email: profileForm.value.email.trim(),
      phone: profileForm.value.phone.trim(),
      address: profileForm.value.address.trim(),
    });
    success.value = 'Profile updated successfully!';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to update profile. Please try again.';
  } finally {
    saving.value = false;
  }
};

const handleUpdatePreferences = async () => {
  if (!userId.value) return;

  savingPreferences.value = true;
  error.value = '';
  success.value = '';

  try {
    profile.value = await userService.updatePreferences(userId.value, {
      language: preferencesForm.value.language,
      displayMode: preferencesForm.value.displayMode,
      notifications: preferencesForm.value.notifications,
    });
    success.value = 'Preferences updated successfully!';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to update preferences. Please try again.';
  } finally {
    savingPreferences.value = false;
  }
};

const handleChangePassword = async () => {
  if (!userId.value) return;

  changingPassword.value = true;
  error.value = '';
  success.value = '';

  try {
    await userService.changePassword(userId.value, passwordForm.value.newPassword);
    success.value = 'Password changed successfully!';
    passwordForm.value.newPassword = '';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err: any) {
    error.value = err.message || 'Failed to change password. Please try again.';
  } finally {
    changingPassword.value = false;
  }
};
</script>

