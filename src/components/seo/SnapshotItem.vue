<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { copyToClipboard } from '../../utils/copyData';

const route = useRoute();
const router = useRouter();
const store = useStore();
const showDelete = ref(false);
const isDeleting = ref(false);

const snapshotId = computed(() => Number(route.params.id));
const snapshot = computed(() => store.getters.getSelectedSnapshot);
const isLoading = computed(() => store.getters.getIsLoading);
const score = computed(() => Math.max(0, Math.min(100, Number(snapshot.value?.score || 0))));
const scoreStyle = computed(() => ({
  background: `conic-gradient(#4f46e5 ${score.value}%, #e2e8f0 0)`,
}));
const keywords = computed(() => snapshot.value?.suggestions?.long_tail_keywords || []);
const issues = computed(() => snapshot.value?.issues || []);

const suggestions = computed(() => [
  { label: 'Improved title', value: snapshot.value?.suggestions?.improved_title },
  { label: 'Meta description', value: snapshot.value?.suggestions?.improved_description },
  { label: 'Suggested H1', value: snapshot.value?.suggestions?.suggested_h1 },
].filter((suggestion) => suggestion.value));

const formattedDate = computed(() => {
  const value = snapshot.value?.createdAt;
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(date);
});

const hostname = computed(() => {
  try {
    return new URL(snapshot.value?.url).hostname.replace(/^www\./, '');
  } catch {
    return snapshot.value?.url || 'Website';
  }
});

const deleteSnapshot = async () => {
  isDeleting.value = true;
  const result = await store.dispatch('deleteSnapshot', { snapId: snapshotId.value });
  isDeleting.value = false;

  if (result?.success) {
    document.body.classList.remove('overflow-hidden');
    await router.push({ name: 'seo-snapshot' });
  }
};

const openDelete = () => {
  showDelete.value = true;
  document.body.classList.add('overflow-hidden');
};
const closeDelete = () => {
  showDelete.value = false;
  document.body.classList.remove('overflow-hidden');
};

onMounted(() => store.dispatch('fetchSnapshotById', { id: snapshotId.value }));
</script>

<template>
  <base-layout>
    <template #header>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Snapshots</p>
        <p class="mt-1 text-sm font-bold text-slate-950 dark:text-white">Analysis details</p>
      </div>
    </template>

    <main class="mx-auto w-full max-w-7xl py-8 sm:py-10">
      <div v-if="isLoading && (!snapshot || snapshot.id !== snapshotId)" class="grid min-h-[60vh] place-items-center">
        <div class="text-center">
          <div class="mx-auto size-8 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600"></div>
          <p class="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Loading snapshot…</p>
        </div>
      </div>

      <template v-else-if="snapshot?.id === snapshotId">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-700" @click="router.push({ name: 'seo-snapshot' })">
            <ArrowLeftIcon class="size-4" />
            Back to snapshots
          </button>
          <a
            :href="snapshot.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Visit live page
            <ArrowTopRightOnSquareIcon class="size-4" />
          </a>
        </div>

        <section class="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div class="min-w-0 max-w-3xl">
              <div class="flex flex-wrap items-center gap-3">
                <span class="rounded-full bg-indigo-50 dark:bg-indigo-500/100/20 px-3 py-1 text-xs font-bold text-indigo-200">{{ snapshot.status || 'Complete' }}</span>
                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">{{ formattedDate }}</span>
              </div>
              <p class="mt-5 text-sm font-semibold text-indigo-300">{{ hostname }}</p>
              <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{{ snapshot.title || 'Untitled page' }}</h1>
              <p class="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{{ snapshot.description || 'No meta description was detected for this page.' }}</p>
              <div class="mt-6 flex flex-wrap gap-5 text-sm text-slate-400 dark:text-slate-500">
                <span><strong class="text-white">{{ Number(snapshot.wordCount || 0).toLocaleString() }}</strong> words</span>
                <span><strong class="text-white">{{ issues.length }}</strong> issues</span>
                <span><strong class="text-white">{{ keywords.length }}</strong> keywords</span>
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div :style="scoreStyle" class="grid size-28 place-items-center rounded-full">
                <div class="grid size-20 place-items-center rounded-full bg-slate-950 text-center">
                  <div>
                    <p class="text-3xl font-black">{{ score }}</p>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Score</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO health</p>
                <p class="mt-1 font-bold">{{ score >= 80 ? 'Strong' : score >= 60 ? 'Needs attention' : 'Needs work' }}</p>
                <p class="mt-1 max-w-32 text-xs leading-5 text-slate-400 dark:text-slate-500">Page-level score from this analysis.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)]">
          <article class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">AI recommendations</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Ready-to-use improvements</h2>

            <div v-if="suggestions.length" class="mt-7 space-y-4">
              <div v-for="suggestion in suggestions" :key="suggestion.label" class="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div class="flex items-center justify-between gap-4">
                  <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ suggestion.label }}</p>
                  <button type="button" class="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-indigo-50 hover:text-indigo-700" @click="copyToClipboard(suggestion.value)">
                    <span class="sr-only">Copy {{ suggestion.label }}</span>
                    <ClipboardDocumentIcon class="size-4" />
                  </button>
                </div>
                <p class="mt-3 text-sm font-medium leading-7 text-slate-700 dark:text-slate-300">{{ suggestion.value }}</p>
              </div>
            </div>
            <p v-else class="mt-7 rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-5 text-sm text-slate-500 dark:text-slate-400">AI recommendations are still being generated.</p>

            <div class="mt-8">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-slate-950 dark:text-white">Recommended keywords</h3>
                <router-link :to="{ name: 'keywords' }" class="text-xs font-bold text-indigo-600">Open keyword workspace</router-link>
              </div>
              <div v-if="keywords.length" class="mt-4 flex flex-wrap gap-2">
                <span v-for="keyword in keywords" :key="keyword" class="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">{{ keyword }}</span>
              </div>
              <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">No keyword recommendations are available yet.</p>
            </div>
          </article>

          <aside class="space-y-6">
            <article class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div class="flex items-center gap-3">
                <span class="flex size-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <ExclamationTriangleIcon class="size-5" />
                </span>
                <div>
                  <p class="font-bold text-slate-950 dark:text-white">Detected issues</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500">{{ issues.length }} item{{ issues.length === 1 ? '' : 's' }} to review</p>
                </div>
              </div>
              <ul v-if="issues.length" class="mt-5 space-y-3">
                <li v-for="issue in issues" :key="issue" class="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <CheckIcon class="mt-1 size-4 shrink-0 text-amber-600" />
                  {{ issue }}
                </li>
              </ul>
              <p v-else class="mt-5 text-sm text-slate-500 dark:text-slate-400">No page-level issues were detected.</p>
            </article>

            <article class="rounded-3xl border border-rose-100 bg-rose-50/60 p-6">
              <p class="text-sm font-bold text-rose-900">Delete this snapshot</p>
              <p class="mt-2 text-xs leading-5 text-rose-700 dark:text-rose-300">This removes the analysis and its recommendations from your history.</p>
              <button type="button" class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300 hover:text-rose-900" @click="openDelete">
                <TrashIcon class="size-4" />
                Delete snapshot
              </button>
            </article>
          </aside>
        </section>
      </template>

      <section v-else class="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-16 text-center">
        <h1 class="text-2xl font-bold text-slate-950 dark:text-white">Snapshot not found</h1>
        <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">This analysis may have been removed or is no longer available.</p>
        <router-link :to="{ name: 'seo-snapshot' }" class="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Return to snapshots</router-link>
      </section>
    </main>

    <div v-if="showDelete" class="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" @click.self="closeDelete">
      <section class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-rose-600">Permanent action</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Delete this snapshot?</h2>
          </div>
          <button type="button" class="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" @click="closeDelete"><XMarkIcon class="size-5" /></button>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">This cannot be undone. The snapshot and its stored recommendations will be permanently removed.</p>
        <div class="mt-7 flex justify-end gap-3">
          <button type="button" class="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300" @click="closeDelete">Cancel</button>
          <button type="button" :disabled="isDeleting" class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" @click="deleteSnapshot">
            {{ isDeleting ? 'Deleting…' : 'Delete snapshot' }}
          </button>
        </div>
      </section>
    </div>
  </base-layout>
</template>
