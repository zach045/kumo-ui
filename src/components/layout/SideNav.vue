<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  ChartBarSquareIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const store = useStore();
const collapsed = computed(() => store.getters.getCollapsed);

const routes = [
  { title: 'Overview', name: 'dashboard', icon: ChartBarSquareIcon },
  { title: 'Snapshots', name: 'seo-snapshot', icon: CameraIcon },
  { title: 'Keywords', name: 'keywords', icon: MagnifyingGlassIcon },
  { title: 'Reports', name: 'reports', icon: DocumentChartBarIcon },
  { title: 'History', name: 'history', icon: ClockIcon },
  { title: 'Settings', name: 'settings', icon: Cog6ToothIcon },
];

const toggleCollapsed = () => store.dispatch('toggleCollapsed');
const signOut = () => store.dispatch('logout');
</script>

<template>
  <aside
    :class="[
      'group sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-slate-950 text-white transition-[width] duration-300',
      collapsed ? 'w-20' : 'w-64',
    ]"
  >
    <div class="flex h-20 items-center border-b border-white/10 px-5">
      <router-link to="/dashboard" class="flex items-center gap-3 overflow-hidden">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-xl font-black">K</span>
        <span v-if="!collapsed" class="text-lg font-bold tracking-tight">Kumo</span>
      </router-link>
    </div>

    <div class="flex min-h-0 flex-1 flex-col px-3 py-6">
      <p v-if="!collapsed" class="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Workspace
      </p>

      <nav class="space-y-1">
        <router-link
          v-for="route in routes"
          :key="route.name"
          :to="{ name: route.name }"
          :title="collapsed ? route.title : undefined"
          class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-400 transition hover:bg-white/8 hover:text-white"
          active-class="bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20"
        >
          <component :is="route.icon" class="size-5 shrink-0" />
          <span v-if="!collapsed">{{ route.title }}</span>
        </router-link>
      </nav>

      <div class="mt-auto space-y-2 border-t border-white/10 pt-5">
        <button
          type="button"
          class="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-400 transition hover:bg-white/8 hover:text-white"
          :title="collapsed ? 'Sign out' : undefined"
          @click="signOut"
        >
          <ArrowRightOnRectangleIcon class="size-5 shrink-0" />
          <span v-if="!collapsed">Sign out</span>
        </button>

        <button
          type="button"
          class="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500 transition hover:bg-white/8 hover:text-slate-300"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleCollapsed"
        >
          <ChevronDoubleLeftIcon :class="['size-4 shrink-0 transition-transform', collapsed && 'rotate-180']" />
          <span v-if="!collapsed">Collapse navigation</span>
        </button>
      </div>
    </div>
  </aside>
</template>
