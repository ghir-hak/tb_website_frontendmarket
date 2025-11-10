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
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900" v-if="user">{{ user.username }}</p>
              <p class="text-xs text-gray-500" v-if="user">{{ user.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            >
              Sign Out
            </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService, type User } from '../services/authService';

const router = useRouter();
const user = ref<User | null>(null);

onMounted(async () => {
  try {
    user.value = await authService.getUser();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    router.push('/auth');
  }
});

const handleLogout = () => {
  authService.logout();
  router.push('/auth');
};
</script>

