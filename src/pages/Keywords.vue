<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import {
  ArrowRightIcon,
  ArrowPathIcon,
  BookmarkIcon,
  CameraIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';

const store = useStore();
const activeTab = ref('opportunities');
const query = ref('');
const selectedSnapshot = ref('all');
const manualTerm = ref('');
const manualPriority = ref('medium');
const pendingTerms = ref(new Set());
const pendingIds = ref(new Set());
const expandedKeywordId = ref(null);

const sites = computed(() => store.getters.getSites || []);
const trackedKeywords = computed(() => store.getters.getKeywords || []);
const snapshotsLoading = computed(() => store.getters.getIsLoading);
const keywordsLoading = computed(() => store.getters.getKeywordsLoading);
const keywordsError = computed(() => store.getters.getKeywordsError);

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

      const currentDate = new Date(existing.latestSource?.createdAt || 0).getTime();
      const candidateDate = new Date(site.createdAt || 0).getTime();
      if (!existing.latestSource || candidateDate >= currentDate) existing.latestSource = site;

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

const trackedTerms = computed(() =>
  new Set(trackedKeywords.value.map((keyword) => keyword.term.trim().toLocaleLowerCase()))
);

const filteredOpportunities = computed(() => {
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

const filteredTrackedKeywords = computed(() => {
  const search = query.value.trim().toLocaleLowerCase();
  if (!search) return trackedKeywords.value;

  return trackedKeywords.value.filter((keyword) =>
    [keyword.term, keyword.notes, keyword.source?.title, keyword.source?.url]
      .some((value) => String(value || '').toLocaleLowerCase().includes(search))
  );
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

const isTracked = (term) => trackedTerms.value.has(term.trim().toLocaleLowerCase());
const isTermPending = (term) => pendingTerms.value.has(term.trim().toLocaleLowerCase());
const isIdPending = (id) => pendingIds.value.has(id);

const withPendingTerm = async (term, callback) => {
  const key = term.trim().toLocaleLowerCase();
  pendingTerms.value = new Set([...pendingTerms.value, key]);
  try {
    return await callback();
  } finally {
    const next = new Set(pendingTerms.value);
    next.delete(key);
    pendingTerms.value = next;
  }
};

const withPendingId = async (id, callback) => {
  pendingIds.value = new Set([...pendingIds.value, id]);
  try {
    return await callback();
  } finally {
    const next = new Set(pendingIds.value);
    next.delete(id);
    pendingIds.value = next;
  }
};

const trackOpportunity = async (row) => {
  if (isTracked(row.keyword) || isTermPending(row.keyword)) return;

  await withPendingTerm(row.keyword, () =>
    store.dispatch('createKeyword', {
      term: row.keyword,
      priority: 'medium',
      status: 'planned',
      snapshotId: row.latestSource?.id || null,
    })
  );
};

const createManualKeyword = async () => {
  const term = manualTerm.value.trim();
  if (!term || isTermPending(term)) return;

  const result = await withPendingTerm(term, () =>
    store.dispatch('createKeyword', {
      term,
      priority: manualPriority.value,
      status: 'planned',
    })
  );

  if (result?.success) {
    manualTerm.value = '';
    manualPriority.value = 'medium';
  }
};

const updateTrackedKeyword = (keyword, changes) =>
  withPendingId(keyword.id, () =>
    store.dispatch('updateKeyword', { id: keyword.id, changes })
  );

const removeTrackedKeyword = async (keyword) => {
  if (!window.confirm(`Stop tracking “${keyword.term}”?`)) return;
  await withPendingId(keyword.id, () => store.dispatch('deleteKeyword', keyword.id));
};

const analysisFor = (id) => store.getters.getKeywordAnalysis(id);

const toggleAnalysis = async (keyword) => {
  if (expandedKeywordId.value === keyword.id) {
    expandedKeywordId.value = null;
    return;
  }

  expandedKeywordId.value = keyword.id;
  if (!analysisFor(keyword.id) && keyword.source) {
    await withPendingId(keyword.id, () => store.dispatch('fetchKeywordAnalysis', keyword.id));
  }
};

const refreshAnalysis = (keyword) =>
  withPendingId(keyword.id, () => store.dispatch('analyzeKeyword', keyword.id));

const rescanKeywordSource = (keyword) =>
  withPendingId(keyword.id, async () => {
    const result = await store.dispatch('analyzeSite', {
      siteUrl: keyword.source.url,
      siteType: 'Website',
    });

    if (!result?.success) return result;

    await store.dispatch('fetchKeywords');
    return store.dispatch('fetchKeywordAnalysis', keyword.id);
  });

const tagLabel = (tag) => ({
  meta_description: 'Meta description',
  img_alt: 'Image alt',
  url: 'URL',
}[tag] || String(tag || '').toUpperCase());

onMounted(() =>
  Promise.all([
    store.dispatch('fetchAllSnapshots'),
    store.dispatch('fetchKeywords'),
  ])
);
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
          <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400">Keyword workspace</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Find opportunities. Track what matters.
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Move source-backed recommendations into a focused keyword plan, then manage their priority and progress.
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
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Opportunities</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ keywordRows.length }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Unique snapshot recommendations</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Tracked</p>
          <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ trackedKeywords.length }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Keywords in your active plan</p>
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
          <strong>Evidence-first metrics:</strong> search volume, ranking difficulty, and position remain hidden until Kumo can back them with a verified data provider.
        </p>
      </aside>

      <div
        v-if="keywordsError"
        role="alert"
        class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
      >
        {{ keywordsError }}
      </div>

      <section class="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <header class="border-b border-slate-100 p-5 dark:border-slate-800">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                v-for="tab in [{ id: 'opportunities', label: 'Opportunities' }, { id: 'tracked', label: 'Tracked keywords' }]"
                :key="tab.id"
                type="button"
                :class="[
                  'rounded-lg px-4 py-2 text-sm font-bold transition',
                  activeTab === tab.id
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
                ]"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
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
              <select
                v-if="activeTab === 'opportunities'"
                v-model="selectedSnapshot"
                aria-label="Filter by snapshot"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:focus:ring-indigo-500/10 sm:w-56"
              >
                <option value="all">All source snapshots</option>
                <option v-for="site in sourceSnapshots" :key="site.id" :value="String(site.id)">
                  {{ site.title || site.url || 'Untitled page' }}
                </option>
              </select>
            </div>
          </div>

          <form
            v-if="activeTab === 'tracked'"
            class="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 sm:grid-cols-[minmax(0,1fr)_150px_auto]"
            @submit.prevent="createManualKeyword"
          >
            <input
              v-model="manualTerm"
              required
              maxlength="150"
              placeholder="Add a keyword manually"
              class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-500/10"
            />
            <select
              v-model="manualPriority"
              aria-label="Keyword priority"
              class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <button
              type="submit"
              :disabled="!manualTerm.trim() || isTermPending(manualTerm)"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon class="size-4" />
              Add keyword
            </button>
          </form>
        </header>

        <div v-if="activeTab === 'opportunities'">
          <div v-if="snapshotsLoading && !sites.length" class="grid min-h-80 place-items-center p-8">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading keyword evidence…</p>
          </div>

          <div v-else-if="filteredOpportunities.length" class="divide-y divide-slate-100 dark:divide-slate-800">
            <article
              v-for="row in filteredOpportunities"
              :key="row.keyword.toLocaleLowerCase()"
              class="grid gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 lg:grid-cols-[minmax(0,1fr)_90px_minmax(200px,0.7fr)_150px] lg:items-center"
            >
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-950 dark:text-white">{{ row.keyword }}</p>
                <p class="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
                  Latest: {{ row.latestSource?.title || row.latestSource?.url || 'Untitled page' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mentions</p>
                <p class="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{{ row.mentions }}</p>
              </div>
              <router-link
                :to="{ name: 'snapshot-item', params: { id: row.latestSource.id } }"
                class="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                <span class="truncate">{{ formatDate(row.latestSource?.createdAt) }}</span>
                <ArrowRightIcon class="size-4 shrink-0" />
              </router-link>
              <button
                type="button"
                :disabled="isTracked(row.keyword) || isTermPending(row.keyword)"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-default disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10 dark:disabled:border-emerald-500/20 dark:disabled:bg-emerald-500/10 dark:disabled:text-emerald-300"
                @click="trackOpportunity(row)"
              >
                <BookmarkIcon class="size-4" />
                {{ isTracked(row.keyword) ? 'Tracked' : isTermPending(row.keyword) ? 'Saving…' : 'Track keyword' }}
              </button>
            </article>
          </div>

          <div v-else class="px-6 py-16 text-center">
            <CameraIcon class="mx-auto size-10 text-indigo-500" />
            <h2 class="mt-4 text-xl font-bold text-slate-950 dark:text-white">No matching opportunities</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Run a snapshot or adjust the current filters.</p>
          </div>
        </div>

        <div v-else>
          <div v-if="keywordsLoading && !trackedKeywords.length" class="grid min-h-80 place-items-center p-8">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading tracked keywords…</p>
          </div>

          <div v-else-if="filteredTrackedKeywords.length" class="divide-y divide-slate-100 dark:divide-slate-800">
            <article
              v-for="keyword in filteredTrackedKeywords"
              :key="keyword.id"
              class="p-5"
            >
              <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px_130px_110px] lg:items-center">
                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-950 dark:text-white">{{ keyword.term }}</p>
                  <router-link
                    v-if="keyword.source"
                    :to="{ name: 'snapshot-item', params: { id: keyword.source.snapshotId } }"
                    class="mt-1 inline-flex max-w-full items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <span class="truncate">{{ keyword.source.title || keyword.source.url || 'Source snapshot' }}</span>
                    <ArrowRightIcon class="size-3.5 shrink-0" />
                  </router-link>
                  <p v-else class="mt-1 text-xs text-slate-400 dark:text-slate-500">Added manually</p>

                  <div
                    v-if="keyword.assessment?.coverageStatus === 'requires_rescan'"
                    class="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                  >
                    <ArrowPathIcon class="size-3.5" />
                    Rescan required
                  </div>
                  <div v-else-if="keyword.assessment" class="mt-3 flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                      Placement {{ keyword.assessment.placementScore }}/100
                    </span>
                    <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Content {{ keyword.assessment.contentQualityScore }}/100
                    </span>
                    <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {{ keyword.assessment.totalOccurrences }} occurrence{{ keyword.assessment.totalOccurrences === 1 ? '' : 's' }}
                    </span>
                  </div>
                  <div
                    v-else-if="keyword.source"
                    class="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    Analysis pending
                  </div>

                  <button
                    v-if="keyword.source"
                    type="button"
                    class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    @click="toggleAnalysis(keyword)"
                  >
                    {{ expandedKeywordId === keyword.id ? 'Hide analysis' : 'View tag analysis' }}
                    <ChevronDownIcon :class="['size-4 transition-transform', expandedKeywordId === keyword.id && 'rotate-180']" />
                  </button>
                </div>

                <select
                  :value="keyword.status"
                  :disabled="isIdPending(keyword.id)"
                  aria-label="Keyword status"
                  class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  @change="updateTrackedKeyword(keyword, { status: $event.target.value })"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>

                <select
                  :value="keyword.priority"
                  :disabled="isIdPending(keyword.id)"
                  aria-label="Keyword priority"
                  class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  @change="updateTrackedKeyword(keyword, { priority: $event.target.value })"
                >
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>

                <button
                  type="button"
                  :disabled="isIdPending(keyword.id)"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 px-3 text-xs font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  :aria-label="`Remove ${keyword.term}`"
                  @click="removeTrackedKeyword(keyword)"
                >
                  <TrashIcon class="size-4" />
                  Remove
                </button>
              </div>

              <section
                v-if="expandedKeywordId === keyword.id"
                class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div v-if="isIdPending(keyword.id) && !analysisFor(keyword.id)" class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading tag evidence…
                </div>

                <div v-else-if="analysisFor(keyword.id)?.coverageStatus === 'requires_rescan'" class="py-5 text-center">
                  <CameraIcon class="mx-auto size-8 text-amber-500" />
                  <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">This snapshot needs to be rescanned</p>
                  <p class="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
                    It was created before Kumo began storing tag-level evidence. Rescan the source page to capture its current title, headings, paragraphs, links, and image alt text.
                  </p>
                  <button
                    type="button"
                    :disabled="isIdPending(keyword.id)"
                    class="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="rescanKeywordSource(keyword)"
                  >
                    <ArrowPathIcon :class="['size-4', isIdPending(keyword.id) && 'animate-spin']" />
                    {{ isIdPending(keyword.id) ? 'Rescanning…' : 'Rescan page' }}
                  </button>
                </div>

                <div v-else-if="analysisFor(keyword.id)">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p class="text-sm font-bold text-slate-950 dark:text-white">On-page evidence</p>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Algorithm {{ analysisFor(keyword.id).algorithmVersion }} · not a Google ranking position
                      </p>
                    </div>
                    <button
                      type="button"
                      :disabled="isIdPending(keyword.id)"
                      class="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 disabled:opacity-40 dark:text-indigo-400"
                      @click="refreshAnalysis(keyword)"
                    >
                      <ArrowPathIcon class="size-4" />
                      Recalculate
                    </button>
                  </div>

                  <div class="mt-4 grid gap-3 sm:grid-cols-3">
                    <div class="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placement</p>
                      <p class="mt-1 text-xl font-bold text-slate-950 dark:text-white">{{ analysisFor(keyword.id).placementScore }}/100</p>
                    </div>
                    <div class="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Content quality</p>
                      <p class="mt-1 text-xl font-bold text-slate-950 dark:text-white">{{ analysisFor(keyword.id).contentQualityScore }}/100</p>
                    </div>
                    <div class="rounded-xl bg-white p-3 dark:bg-slate-900">
                      <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Combined</p>
                      <p class="mt-1 text-xl font-bold text-slate-950 dark:text-white">{{ analysisFor(keyword.id).overallScore }}/100</p>
                    </div>
                  </div>

                  <div class="mt-4 grid gap-3 md:grid-cols-2">
                    <article
                      v-for="(score, tag) in analysisFor(keyword.id).tagScores"
                      :key="tag"
                      class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <p class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ tagLabel(tag) }}</p>
                        <span :class="['text-[11px] font-bold', score.found ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400']">
                          {{ score.found ? `${score.occurrences} found` : 'Not found' }}
                        </span>
                      </div>
                      <p class="mt-1 text-[11px] text-slate-400">
                        Placement weight {{ score.placementWeight }} · Quality {{ score.qualityScore ?? '—' }}
                      </p>
                    </article>
                  </div>

                  <div v-if="analysisFor(keyword.id).occurrences?.length" class="mt-5">
                    <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Captured occurrences</p>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="(occurrence, index) in analysisFor(keyword.id).occurrences"
                        :key="`${occurrence.tag}-${index}`"
                        class="rounded-xl bg-white p-3 dark:bg-slate-900"
                      >
                        <div class="flex items-center justify-between gap-3">
                          <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{{ tagLabel(occurrence.tag) }}</span>
                          <span class="text-[11px] text-slate-400">Quality {{ occurrence.qualityScore }}/100</span>
                        </div>
                        <p class="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ occurrence.excerpt }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="analysisFor(keyword.id).findings?.length" class="mt-5">
                    <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Findings</p>
                    <ul class="mt-2 space-y-2">
                      <li
                        v-for="(finding, index) in analysisFor(keyword.id).findings"
                        :key="index"
                        class="rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <strong v-if="finding.tag">{{ tagLabel(finding.tag) }}:</strong>
                        {{ finding.message }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-else class="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No analysis is available for this keyword.
                </div>
              </section>
            </article>
          </div>

          <div v-else class="px-6 py-16 text-center">
            <BookmarkIcon class="mx-auto size-10 text-indigo-500" />
            <h2 class="mt-4 text-xl font-bold text-slate-950 dark:text-white">No tracked keywords yet</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Track a recommendation or add your first keyword manually.</p>
            <button type="button" class="mt-5 text-sm font-bold text-indigo-600 dark:text-indigo-400" @click="activeTab = 'opportunities'">
              Browse opportunities
            </button>
          </div>
        </div>
      </section>
    </main>
  </base-layout>
</template>
