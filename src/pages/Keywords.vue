<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import {
  ArrowRightIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

const store = useStore();
const query = ref('');
const selectedSnapshot = ref('all');

const sites = computed(() => store.getters.getSites || []);
const isLoading = computed(() => store.getters.getIsLoading);

const recommendationCount = computed(() =>
  sites.value.reduce((total, site) => {
    const keywords = site.suggestions?.long_tail_keywords;
    return total + (Array.isArray(keywords) ? keywords.filter(Boolean).length : 0);
  }, 0)
);

const keywordRows = computed(() => {
  const rows = new Map();

  sites.value.forEach((site) => {
    const keywords = site.suggestions?.long_tail_keywords;
    if (!Array.isArray(keywords)) return;

    keywords.forEach((value) => {
      const keyword = String(value || '').trim();
      if (!keyword) return;

      const key = keyword.toLocaleLowerCase();
      const existing = rows.get(key) || {
        keyword,
        mentions: 0,
        sources: new Map(),
        latestSource: null,
      };

      existing.mentions += 1;
      existing.sources.set(String(site.id), site);

      const existingDate = new Date(existing.latestSource?.createdAt || 0).getTime();
      const candidateDate = new Date(site.createdAt || 0).getTime();
      if (!existing.latestSource || candidateDate >= existingDate) existing.latestSource = site;

      rows.set(key, existing);
    });
  });

  return [...rows.values()]
    .map((row) => ({ ...row, sources: [...row.sources.values()] }))
    .sort((a, b) => b.mentions - a.mentions || a.keyword.localeCompare(b.keyword));
});

const sourceSnapshots = computed(() =>
  sites.value
    .filter((site) => Array.isArray(site.suggestions?.long_tail_keywords) && site.suggestions.long_tail_keywords.length)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
);

const filteredRows = computed(() => {
  const search = query.value.trim().toLocaleLowerCase();

  return keywordRows.value.filter((row) => {
    const matchesQuery =
      !search ||
      row.keyword.toLocaleLowerCase().includes(search) ||
      row.sources.some((source) =>
        [source.title, source.url].some((value) => String(value || '').toLocaleLowerCase().includes(search))
      );

    const matchesSnapshot =
      selectedSnapshot.value === 'all' ||
      row.sources.some((source) => String(source.id) === selectedSnapshot.value);

    return matchesQuery && matchesSnapshot;
  });
});

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

onMounted(() => store.dispatch('fetchAllSnapshots'));
</script>

<template>
  <base-layout>
    <template #header>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Research</p>
        <p class="mt-1 text-sm font-bold text-slate-950 dark:text-white">Keywords</p>
      </div>
    </template>

    <main class="mx-auto w-full max-w-7xl py-8 sm:py-10">
      <section class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">Keyword opportunities</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Turn snapshot evidence into content ideas.
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Explore the long-tail keyword recommendations produced by your analyses, with every suggestion tied back to its source snapshot.
          </p>
        </div>
        <router-link
          :to="{ name: 'seo-snapshot' }"
          class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-none"
        >
          <PlusIcon class="size-5" />
          New snapshot
        </router-link>
      </section>

      <section class="mt-8 grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Unique keywords</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ keywordRows.length }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Deduplicated across analyses</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Recommendations</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ recommendationCount }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Total keyword mentions</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Source pages</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ sourceSnapshots.length }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Snapshots with keyword evidence</p>
        </article>
      </section>

      <aside class="mt-6 flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
        <SparklesIcon class="mt-0.5 size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <p class="leading-6">
          <strong>Evidence-first metrics:</strong> Kumo is showing recommendations and their sources only. Search volume, ranking difficulty, and position will not appear until they can be backed by a verified data provider.
        </p>
      </aside>

      <section class="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <header class="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm font-bold text-slate-950 dark:text-white">
              {{ filteredRows.length }} keyword{{ filteredRows.length === 1 ? '' : 's' }}
            </p>
            <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">Sorted by recommendation frequency</p>
          </div>
          <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label class="relative block w-full sm:w-72">
              <span class="sr-only">Search keywords</span>
              <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                v-model="query"
                type="search"
                placeholder="Search keywords or sources"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/10"
              />
            </label>
            <label class="block">
              <span class="sr-only">Filter by snapshot</span>
              <select
                v-model="selectedSnapshot"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:focus:ring-indigo-500/10 sm:w-56"
              >
                <option value="all">All source snapshots</option>
                <option v-for="site in sourceSnapshots" :key="site.id" :value="String(site.id)">
                  {{ site.title || site.url || 'Untitled page' }}
                </option>
              </select>
            </label>
          </div>
        </header>

        <div v-if="isLoading && !sites.length" class="grid min-h-80 place-items-center p-8">
          <div class="text-center">
            <div class="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700"></div>
            <p class="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading keyword evidence…</p>
          </div>
        </div>

        <div v-else-if="filteredRows.length" class="divide-y divide-slate-100 dark:divide-slate-800">
          <article
            v-for="row in filteredRows"
            :key="row.keyword.toLocaleLowerCase()"
            class="grid gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 md:grid-cols-[minmax(0,1fr)_100px_minmax(220px,0.8fr)_32px] md:items-center"
          >
            <div class="min-w-0">
              <p class="text-sm font-bold text-slate-950 dark:text-white">{{ row.keyword }}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="source in row.sources.slice(0, 3)"
                  :key="source.id"
                  class="max-w-52 truncate rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {{ source.title || source.url || 'Untitled page' }}
                </span>
                <span v-if="row.sources.length > 3" class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  +{{ row.sources.length - 3 }} more
                </span>
              </div>
            </div>

            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mentions</p>
              <p class="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{{ row.mentions }}</p>
            </div>

            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Latest evidence</p>
              <p class="mt-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {{ row.latestSource?.title || row.latestSource?.url || 'Untitled page' }}
              </p>
              <p class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{{ formatDate(row.latestSource?.createdAt) }}</p>
            </div>

            <router-link
              :to="{ name: 'snapshot-item', params: { id: row.latestSource.id } }"
              class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              :aria-label="`Open source snapshot for ${row.keyword}`"
            >
              <ArrowRightIcon class="size-5" />
            </router-link>
          </article>
        </div>

        <div v-else class="px-6 py-16 text-center">
          <span class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <CameraIcon class="size-7" />
          </span>
          <h2 class="mt-5 text-xl font-bold text-slate-950 dark:text-white">
            {{ keywordRows.length ? 'No matching keywords' : 'No keyword recommendations yet' }}
          </h2>
          <p class="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
            {{ keywordRows.length ? 'Adjust your search or source filter.' : 'Run a new snapshot to generate source-backed keyword opportunities for this workspace.' }}
          </p>
          <router-link
            v-if="!keywordRows.length"
            :to="{ name: 'seo-snapshot' }"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Create snapshot
            <ArrowRightIcon class="size-4" />
          </router-link>
        </div>
      </section>
    </main>
  </base-layout>
</template>
