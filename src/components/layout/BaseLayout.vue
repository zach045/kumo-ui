<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import SideNav from './SideNav.vue';
import MobileNav from './MobileNav.vue';
import { MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { useTheme } from '../../composables/useTheme';

const store = useStore();
const user = computed(() => store.getters.getUser);
const { isDark, themeLabel, toggleTheme } = useTheme();
</script>

<template>
  <div :class="{ dark: isDark }" class="kumo-app relative flex min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
    <div class="sticky left-0 top-0 z-50 hidden h-screen lg:flex">
      <SideNav />
    </div>

    <section class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90 lg:flex">
        <div>
          <slot name="header">
            <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">Untitled page</span>
          </slot>
        </div>

        <div v-if="user?.name" class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Signed in as</p>
            <p class="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">Hi, {{ user.name }}</p>
          </div>
          <UserCircleIcon class="size-9 text-slate-400 dark:text-slate-500" />
          <button
            type="button"
            class="ml-1 flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            :aria-label="themeLabel"
            :title="themeLabel"
            @click="toggleTheme"
          >
            <SunIcon v-if="isDark" class="size-5" />
            <MoonIcon v-else class="size-5" />
          </button>
        </div>
      </header>

      <div class="flex w-full lg:hidden">
        <MobileNav />
      </div>

      <div class="w-full flex-1 px-4 sm:px-6 lg:px-8">
        <slot>
          <div class="py-8 text-sm text-slate-500 dark:text-slate-400">No content provided.</div>
        </slot>
      </div>
    </section>
  </div>
</template>
