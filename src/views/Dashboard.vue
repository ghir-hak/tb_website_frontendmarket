<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-2xl font-light text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- User Dropdown -->
            <div class="relative" v-if="user" ref="dropdownContainerRef">
              <button
                @click.stop="showDropdown = !showDropdown"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
              >
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ user.username }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showDropdown"
                ref="dropdownRef"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <button
                  @click="goToProfile"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  View Profile
                </button>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="max-w-md mx-auto">
          <div class="mb-6">
            <svg
              class="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-light text-gray-900 mb-2">Welcome to your Dashboard</h2>
          <p class="text-gray-500 mb-8">Your dashboard is ready. Start building your application here.</p>
        </div>
      </div>
    </main>

    <!-- Profile Completion Modal -->
    <ProfileCompletionModal
      v-if="showProfileModal"
      :show="showProfileModal"
      :userId="userId || ''"
      @close="showProfileModal = false"
      @completed="handleProfileCompleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService, type User } from '../services/authService';
import { userService, type UserProfile } from '../services/userService';
import ProfileCompletionModal from '../components/ProfileCompletionModal.vue';

const router = useRouter();
const user = ref<User | null>(null);
const showDropdown = ref(false);
const showProfileModal = ref(false);
const userId = ref<string | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownContainerRef = ref<HTMLElement | null>(null);

// Handle click outside dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(async () => {
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);

  try {
    user.value = await authService.getUser();
    userId.value = authService.getUserId();

    // Check profile completeness
    if (userId.value) {
      try {
        const profile = await userService.getUserProfile(userId.value);
        if (!isProfileComplete(profile)) {
          // Check if we've already shown the modal in this session
          const profileModalShown = sessionStorage.getItem('profileModalShown');
          if (!profileModalShown) {
            showProfileModal.value = true;
            sessionStorage.setItem('profileModalShown', 'true');
          }
        }
      } catch (error) {
        // If profile doesn't exist or error, show modal
        const profileModalShown = sessionStorage.getItem('profileModalShown');
        if (!profileModalShown) {
          showProfileModal.value = true;
          sessionStorage.setItem('profileModalShown', 'true');
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    router.push('/auth');
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Check if profile is complete
const isProfileComplete = (profile: UserProfile): boolean => {
  return !!(
    profile.name &&
    profile.name.trim() !== '' &&
    profile.phone &&
    profile.phone.trim() !== '' &&
    profile.address &&
    profile.address.trim() !== ''
  );
};

onMounted(async () => {
  try {
    user.value = await authService.getUser();
    userId.value = authService.getUserId();

    // Check profile completeness
    if (userId.value) {
      try {
        const profile = await userService.getUserProfile(userId.value);
        if (!isProfileComplete(profile)) {
          // Check if we've already shown the modal in this session
          const profileModalShown = sessionStorage.getItem('profileModalShown');
          if (!profileModalShown) {
            showProfileModal.value = true;
            sessionStorage.setItem('profileModalShown', 'true');
          }
        }
      } catch (error) {
        // If profile doesn't exist or error, show modal
        const profileModalShown = sessionStorage.getItem('profileModalShown');
        if (!profileModalShown) {
          showProfileModal.value = true;
          sessionStorage.setItem('profileModalShown', 'true');
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    router.push('/auth');
  }
});

const goToProfile = () => {
  showDropdown.value = false;
  router.push('/profile');
};

const handleLogout = () => {
  showDropdown.value = false;
  authService.logout();
  sessionStorage.removeItem('profileModalShown');
  router.push('/auth');
};

const handleProfileCompleted = () => {
  showProfileModal.value = false;
  // Optionally refresh the page or show a success message
};
</script>


