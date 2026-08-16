<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import SideNav from './SideNav.vue';
import MobileNav from './MobileNav.vue';
import { UserCircleIcon } from '@heroicons/vue/24/outline';

const store = useStore();
const user = computed(() => store.getters.getUser);
</script>

<template>
  <div class="relative flex min-h-screen w-full bg-slate-50">
    <div class="sticky left-0 top-0 z-50 hidden h-screen lg:flex">
      <SideNav />
    </div>

    <section class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur lg:flex">
        <div>
          <slot name="header">
            <span class="text-sm font-semibold text-slate-900">Untitled page</span>
          </slot>
        </div>

        <div v-if="user?.name" class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-xs font-medium text-slate-400">Signed in as</p>
            <p class="text-sm font-semibold tracking-tight text-slate-800">Hi, {{ user.name }}</p>
          </div>
          <UserCircleIcon class="size-9 text-slate-400" />
        </div>
      </header>

      <div class="flex w-full lg:hidden">
        <MobileNav />
      </div>

      <div class="w-full flex-1 px-4 sm:px-6 lg:px-8">
        <slot>
          <div class="py-8 text-sm text-slate-500">No content provided.</div>
        </slot>
      </div>
    </section>
  </div>
</template>
