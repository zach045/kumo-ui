<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
  ArrowRightIcon,
  CameraIcon,
  ChartBarSquareIcon,
  ClockIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

const store = useStore();
const user = computed(() => store.getters.getUser);
const insights = computed(() => store.getters.getInsights);
const isLoading = computed(() => store.getters.getIsLoading);
const lastSnapshot = computed(() => insights.value?.lastSnapshot || null);

const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || 'there');
const keywords = computed(() => lastSnapshot.value?.suggestions?.long_tail_keywords || []);
const score = computed(() => Math.max(0, Math.min(100, Number(lastSnapshot.value?.score || 0))));
const scoreStyle = computed(() => ({
  background: `conic-gradient(#4f46e5 ${score.value}%, #e2e8f0 0)`,
}));

const formattedDate = computed(() => {
  const value = lastSnapshot.value?.createdAt;
  if (!value) return 'Not available';

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value).slice(0, 10)
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
});

const hostname = computed(() => {
  try {
    return new URL(lastSnapshot.value?.url).hostname.replace(/^www\./, '');
  } catch {
    return lastSnapshot.value?.url || 'Website';
  }
});

const metrics = computed(() => [
  {
    label: 'Average SEO score',
    value: insights.value ? `${insights.value.scoreAverage || 0}/100` : '—',
    detail: 'Across all snapshots',
    icon: ChartBarSquareIcon,
    tone: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  },
  {
    label: 'Total snapshots',
    value: insights.value?.snapshotCount ?? '—',
    detail: 'Analyses completed',
    icon: CameraIcon,
    tone: 'bg-cyan-50 text-cyan-700',
  },
  {
    label: 'Average word count',
    value: insights.value?.wordCountAverage?.toLocaleString?.() ?? insights.value?.wordCountAverage ?? '—',
    detail: 'Content depth baseline',
    icon: DocumentChartBarIcon,
    tone: 'bg-violet-50 text-violet-700',
  },
]);

const quickActions = [
  {
    title: 'Run a snapshot',
    description: 'Analyze a page and generate fresh SEO recommendations.',
    route: 'seo-snapshot',
    icon: PlusIcon,
    accent: 'bg-indigo-600 text-white',
  },
  {
    title: 'Research keywords',
    description: 'Build the search strategy behind your next page.',
    route: 'keywords',
    icon: MagnifyingGlassIcon,
    accent: 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white',
  },
  {
    title: 'Create a report',
    description: 'Package your insights into a clear progress report.',
    route: 'reports',
    icon: DocumentChartBarIcon,
    accent: 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white',
  },
];

onMounted(async () => {
  await store.dispatch('fetchInsights');
});
</script>

<template>
  <base-layout>
    <template #header>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Workspace</p>
        <p class="mt-1 text-sm font-bold text-slate-950 dark:text-white">Overview</p>
      </div>
    </template>

    <main class="mx-auto w-full max-w-7xl py-8 sm:py-10">
      <section class="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 dark:shadow-none sm:px-10 sm:py-10">
        <div class="absolute -right-20 -top-32 size-80 rounded-full bg-indigo-50 dark:bg-indigo-500/100/25 blur-3xl"></div>
        <div class="absolute -bottom-36 left-1/3 size-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

        <div class="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div class="max-w-2xl">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-200">
              <SparklesIcon class="size-4" />
              Your SEO command center
            </span>
            <h1 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {{ firstName }}.</h1>
            <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Track what is improving, act on your latest recommendations, and keep your optimization work moving.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <router-link
              :to="{ name: 'seo-snapshot' }"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <PlusIcon class="size-5" />
              New snapshot
            </router-link>
            <router-link
              :to="{ name: 'history' }"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-zinc-900"
            >
              <ClockIcon class="size-5" />
              View history
            </router-link>
          </div>
        </div>
      </section>

      <section class="mt-6 grid gap-4 md:grid-cols-3">
        <article
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ metric.label }}</p>
              <p class="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{{ metric.value }}</p>
              <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">{{ metric.detail }}</p>
            </div>
            <span :class="['flex size-11 items-center justify-center rounded-xl', metric.tone]">
              <component :is="metric.icon" class="size-5" />
            </span>
          </div>
        </article>
      </section>

      <div v-if="isLoading && !insights" class="mt-6 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
        <div class="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600"></div>
        <p class="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading your latest insights…</p>
      </div>

      <section v-else-if="lastSnapshot" class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.75fr)]">
        <article class="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <header class="flex flex-col gap-5 border-b border-slate-100 dark:border-slate-800 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Latest snapshot</p>
                <span class="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {{ lastSnapshot.status || 'Complete' }}
                </span>
              </div>
              <h2 class="mt-3 truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{{ lastSnapshot.title || hostname }}</h2>
              <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span>{{ hostname }}</span>
                <span>{{ formattedDate }}</span>
                <span>{{ lastSnapshot.wordCount?.toLocaleString?.() || lastSnapshot.wordCount || 0 }} words</span>
              </div>
            </div>
            <router-link
              :to="{ name: 'snapshot-item', params: { id: lastSnapshot.id } }"
              class="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Full analysis
              <ArrowRightIcon class="size-4" />
            </router-link>
          </header>

          <div class="grid gap-6 p-6 lg:grid-cols-[180px_minmax(0,1fr)]">
            <div class="flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-5">
              <div :style="scoreStyle" class="grid size-32 place-items-center rounded-full">
                <div class="grid size-24 place-items-center rounded-full bg-white dark:bg-slate-900 text-center shadow-sm">
                  <div>
                    <p class="text-3xl font-black text-slate-950 dark:text-white">{{ score }}</p>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">SEO score</p>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">Your most recent page-level result.</p>
            </div>

            <div>
              <p class="text-sm font-bold text-slate-950 dark:text-white">Top recommendation</p>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {{ lastSnapshot.suggestions?.urgent_issue || lastSnapshot.issues?.[0] || 'Keep monitoring this page as you publish new improvements.' }}
              </p>

              <div class="mt-6 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Suggested title</p>
                  <p class="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                    {{ lastSnapshot.suggestions?.improved_title || 'No title recommendation yet.' }}
                  </p>
                </div>
                <div class="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Suggested H1</p>
                  <p class="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                    {{ lastSnapshot.suggestions?.suggested_h1 || 'No H1 recommendation yet.' }}
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-bold text-slate-950 dark:text-white">Recommended keywords</p>
                  <router-link :to="{ name: 'keywords' }" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300">Explore keywords</router-link>
                </div>
                <div v-if="keywords.length" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="keyword in keywords.slice(0, 8)"
                    :key="keyword"
                    class="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                  >
                    {{ keyword }}
                  </span>
                </div>
                <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">Keyword recommendations will appear after analysis completes.</p>
              </div>
            </div>
          </div>

          <footer v-if="lastSnapshot.issues?.length" class="border-t border-amber-100 bg-amber-50/70 px-6 py-4">
            <div class="flex items-start gap-3">
              <ExclamationTriangleIcon class="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p class="text-sm text-amber-900">
                <span class="font-bold">{{ lastSnapshot.issues.length }} issue{{ lastSnapshot.issues.length === 1 ? '' : 's' }} detected.</span>
                Review the full analysis before your next content update.
              </p>
            </div>
          </footer>
        </article>

        <aside class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Next best actions</p>
          <h2 class="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white">Keep the momentum going</h2>

          <div class="mt-6 space-y-3">
            <router-link
              v-for="action in quickActions"
              :key="action.title"
              :to="{ name: action.route }"
              :class="['group block rounded-2xl border border-slate-200 dark:border-slate-700 p-4 transition hover:-translate-y-0.5 hover:shadow-md', action.accent]"
            >
              <div class="flex items-start gap-3">
                <component :is="action.icon" class="mt-0.5 size-5 shrink-0" />
                <div>
                  <p class="text-sm font-bold">{{ action.title }}</p>
                  <p :class="['mt-1 text-xs leading-5', action.accent.includes('bg-indigo') ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400']">
                    {{ action.description }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </aside>
      </section>

      <section v-else class="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white dark:bg-slate-900 px-6 py-14 text-center shadow-sm">
        <span class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
          <CameraIcon class="size-7" />
        </span>
        <h2 class="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Create your first SEO snapshot</h2>
        <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
          Analyze a page to populate your dashboard with scores, issues, keyword opportunities, and AI-powered recommendations.
        </p>
        <router-link
          :to="{ name: 'seo-snapshot' }"
          class="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Run your first snapshot
          <ArrowRightIcon class="size-4" />
        </router-link>
      </section>
    </main>
  </base-layout>
</template>
