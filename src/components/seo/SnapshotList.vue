<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  ArrowRightIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import SnapshotForm from './SnapshotForm.vue';

const store = useStore();
const isOpen = ref(false);
const query = ref('');
const pageNumber = ref(1);
const pageSize = 8;
const form = reactive({ url: '', desc: '' });

const fields = [
  { key: 'url', placeholder: 'https://example.com', type: 'url', label: 'Website URL' },
  { key: 'desc', placeholder: 'SaaS, local business, portfolio…', type: 'text', label: 'Website type' },
];

const sites = computed(() => store.getters.getSites || []);
const isLoading = computed(() => store.getters.getIsLoading);
const filteredSites = computed(() => {
  const search = query.value.trim().toLowerCase();
  if (!search) return sites.value;
  return sites.value.filter((site) =>
    [site.title, site.url, site.status].some((value) => String(value || '').toLowerCase().includes(search))
  );
});
const pageCount = computed(() => Math.max(1, Math.ceil(filteredSites.value.length / pageSize)));
const paginatedSites = computed(() => {
  const start = (pageNumber.value - 1) * pageSize;
  return filteredSites.value.slice(start, start + pageSize);
});
const rangeStart = computed(() => filteredSites.value.length ? (pageNumber.value - 1) * pageSize + 1 : 0);
const rangeEnd = computed(() => Math.min(pageNumber.value * pageSize, filteredSites.value.length));

watch(query, () => { pageNumber.value = 1; });

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(date);
};

const scoreTone = (score) => {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700';
  if (score >= 60) return 'bg-amber-50 text-amber-700';
  return 'bg-rose-50 text-rose-700';
};

const openModal = () => {
  isOpen.value = true;
  document.body.classList.add('overflow-hidden');
};
const closeModal = () => {
  isOpen.value = false;
  document.body.classList.remove('overflow-hidden');
};

const handleAnalyze = async () => {
  const result = await store.dispatch('analyzeSite', { siteUrl: form.url, siteType: form.desc });
  if (result?.success) {
    form.url = '';
    form.desc = '';
    closeModal();
  }
};

onMounted(() => store.dispatch('fetchAllSnapshots'));
</script>

<template>
  <base-layout>
    <template #header>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Analysis</p>
        <p class="mt-1 text-sm font-bold text-slate-950">Snapshots</p>
      </div>
    </template>

    <main class="mx-auto w-full max-w-7xl py-8 sm:py-10">
      <section class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="text-sm font-bold text-indigo-600">SEO snapshot library</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Every analysis, in one place.</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Review previous scans, monitor scores, and open any snapshot for its complete AI recommendations.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          @click="openModal"
        >
          <PlusIcon class="size-5" />
          New snapshot
        </button>
      </section>

      <section class="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header class="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-bold text-slate-950">{{ filteredSites.length }} snapshot{{ filteredSites.length === 1 ? '' : 's' }}</p>
            <p class="mt-1 text-xs text-slate-400">Most recent analyses appear first</p>
          </div>
          <label class="relative block w-full sm:w-72">
            <span class="sr-only">Search snapshots</span>
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="query"
              type="search"
              placeholder="Search title, URL, or status"
              class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </label>
        </header>

        <div v-if="isLoading && !sites.length" class="grid min-h-80 place-items-center p-8">
          <div class="text-center">
            <div class="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600"></div>
            <p class="mt-4 text-sm font-medium text-slate-500">Loading snapshots…</p>
          </div>
        </div>

        <div v-else-if="paginatedSites.length" class="divide-y divide-slate-100">
          <router-link
            v-for="site in paginatedSites"
            :key="site.id"
            :to="{ name: 'snapshot-item', params: { id: site.id } }"
            class="group grid gap-4 p-5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_110px_120px_120px_24px] sm:items-center"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-3">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CameraIcon class="size-5" />
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-bold text-slate-950">{{ site.title || 'Untitled page' }}</p>
                  <p class="mt-1 truncate text-xs text-slate-400">{{ site.url }}</p>
                </div>
              </div>
            </div>

            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Score</p>
              <span :class="['mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold sm:mt-0', scoreTone(Number(site.score || 0))]">
                {{ site.score ?? '—' }}/100
              </span>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Words</p>
              <p class="mt-1 text-sm font-semibold text-slate-600 sm:mt-0">{{ Number(site.wordCount || 0).toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Created</p>
              <p class="mt-1 text-xs font-medium text-slate-500 sm:mt-0">{{ formatDate(site.createdAt) }}</p>
            </div>
            <ArrowRightIcon class="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
          </router-link>
        </div>

        <div v-else class="px-6 py-16 text-center">
          <span class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CameraIcon class="size-7" />
          </span>
          <h2 class="mt-5 text-xl font-bold text-slate-950">{{ query ? 'No matching snapshots' : 'No snapshots yet' }}</h2>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {{ query ? 'Try a different search term.' : 'Analyze your first website to begin building an SEO performance history.' }}
          </p>
          <button v-if="!query" type="button" class="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white" @click="openModal">
            Create snapshot
          </button>
        </div>

        <footer v-if="filteredSites.length" class="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredSites.length }}</p>
          <div class="flex items-center gap-2">
            <button type="button" :disabled="pageNumber === 1" class="rounded-lg border border-slate-200 p-2 disabled:opacity-30" @click="pageNumber--">
              <ChevronLeftIcon class="size-4" />
            </button>
            <span class="px-2 font-semibold text-slate-700">{{ pageNumber }} / {{ pageCount }}</span>
            <button type="button" :disabled="pageNumber === pageCount" class="rounded-lg border border-slate-200 p-2 disabled:opacity-30" @click="pageNumber++">
              <ChevronRightIcon class="size-4" />
            </button>
          </div>
        </footer>
      </section>
    </main>

    <div v-if="isOpen" class="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" @click.self="closeModal">
      <section class="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <header class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">New analysis</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-950">Create an SEO snapshot</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500">Enter a public page URL and tell Kumo what kind of site it is.</p>
          </div>
          <button type="button" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <XMarkIcon class="size-6" />
          </button>
        </header>
        <SnapshotForm :form="form" :fields="fields" :is-loading="isLoading" @analyze="handleAnalyze" />
      </section>
    </div>
  </base-layout>
</template>
