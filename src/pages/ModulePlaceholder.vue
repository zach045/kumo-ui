<script setup>
import { ArrowRightIcon, SparklesIcon } from '@heroicons/vue/24/outline';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
});
</script>

<template>
  <base-layout>
    <template #header>
      <span class="text-sm font-semibold text-slate-900">{{ title }}</span>
    </template>

    <main class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center py-10">
      <section class="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="relative px-6 py-14 sm:px-10 lg:px-16">
          <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400"></div>
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
              <SparklesIcon class="size-4" />
              Next module
            </span>
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-950">{{ title }}</h1>
            <p class="mt-4 text-lg leading-8 text-slate-600">{{ description }}</p>
            <p class="mt-7 text-sm leading-6 text-slate-500">
              The navigation and route are ready. We’ll define the data model, API contract, loading states, and complete interface when we review this module.
            </p>
            <router-link
              :to="{ name: 'dashboard' }"
              class="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Return to overview
              <ArrowRightIcon class="size-4" />
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </base-layout>
</template>
