<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarSquareIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const isOpen = ref(false);
const store = useStore();
const user = computed(() => store.getters.getUser);

const routes = [
  { title: 'Overview', name: 'dashboard', icon: ChartBarSquareIcon },
  { title: 'Snapshots', name: 'seo-snapshot', icon: CameraIcon },
  { title: 'Keywords', name: 'keywords', icon: MagnifyingGlassIcon },
  { title: 'Reports', name: 'reports', icon: DocumentChartBarIcon },
  { title: 'History', name: 'history', icon: ClockIcon },
  { title: 'Settings', name: 'settings', icon: Cog6ToothIcon },
];

const closeMenu = () => { isOpen.value = false; };
const signOut = async () => {
  closeMenu();
  await store.dispatch('logout');
};
</script>

<template>
  <header class="relative z-40 w-full border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
    <div class="flex items-center justify-between">
      <router-link :to="{ name: 'dashboard' }" class="flex items-center gap-3" @click="closeMenu">
        <span class="flex size-9 items-center justify-center rounded-xl bg-indigo-600 font-black text-white">K</span>
        <span class="font-bold tracking-tight text-slate-950">Kumo</span>
      </router-link>

      <div class="flex items-center gap-3">
        <span v-if="user?.name" class="hidden text-sm font-medium text-slate-500 sm:block">{{ user.name }}</span>
        <button
          type="button"
          class="flex size-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          :aria-expanded="isOpen"
          aria-label="Toggle dashboard navigation"
          @click="isOpen = !isOpen"
        >
          <XMarkIcon v-if="isOpen" class="size-6" />
          <Bars3Icon v-else class="size-6" />
        </button>
      </div>
    </div>

    <nav v-if="isOpen" class="absolute left-0 top-full w-full border-b border-slate-200 bg-white p-4 shadow-xl">
      <div class="grid gap-1">
        <router-link
          v-for="route in routes"
          :key="route.name"
          :to="{ name: route.name }"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
          active-class="bg-indigo-50 text-indigo-700"
          @click="closeMenu"
        >
          <component :is="route.icon" class="size-5" />
          {{ route.title }}
        </router-link>

        <button
          type="button"
          class="mt-3 flex items-center gap-3 border-t border-slate-100 px-4 pt-4 text-sm font-semibold text-slate-500"
          @click="signOut"
        >
          <ArrowRightOnRectangleIcon class="size-5" />
          Sign out
        </button>
      </div>
    </nav>
  </header>
</template>
