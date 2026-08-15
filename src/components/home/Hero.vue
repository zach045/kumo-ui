<script setup>
import { ArrowRightIcon, CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.getters.getUser);
const primaryRoute = computed(() => ({ name: user.value ? 'dashboard' : 'signup' }));
</script>

<template>
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100 pt-20">
        <div class="pointer-events-none absolute -left-32 top-36 size-80 rounded-full bg-sky-300/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 top-12 size-96 rounded-full bg-indigo-400/20 blur-3xl"></div>

        <div class="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div class="max-w-2xl">
                <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
                    <MagnifyingGlassIcon class="size-4" />
                    Clear SEO insights. Smarter next steps.
                </div>

                <h1 class="text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
                    Understand what’s holding your website back.
                </h1>

                <p class="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                    Kumo turns your website data into a clear SEO score, practical insights, and prioritized recommendations—so you know exactly what to improve next.
                </p>

                <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                    <router-link
                        :to="primaryRoute"
                        class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                    >
                        {{ user ? 'Go to Dashboard' : 'Get Started Free' }}
                        <ArrowRightIcon class="size-4" />
                    </router-link>
                    <a
                        href="#how-it-works"
                        class="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-6 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                    >
                        See How It Works
                    </a>
                </div>

                <div class="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                    <span class="flex items-center gap-2">
                        <CheckCircleIcon class="size-5 text-emerald-500" />
                        Fast website analysis
                    </span>
                    <span class="flex items-center gap-2">
                        <CheckCircleIcon class="size-5 text-emerald-500" />
                        Actionable recommendations
                    </span>
                </div>
            </div>

            <div class="relative mx-auto w-full max-w-xl">
                <div class="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-sky-300/30 to-indigo-400/30 blur-2xl"></div>
                <div class="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl shadow-indigo-200/60">
                    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <p class="text-sm font-semibold text-slate-900">SEO Overview</p>
                            <p class="mt-1 text-xs text-slate-400">yourwebsite.com</p>
                        </div>
                        <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Analysis complete</span>
                    </div>

                    <div class="grid gap-5 p-6 sm:grid-cols-[160px_1fr]">
                        <div class="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-5">
                            <div class="flex size-28 items-center justify-center rounded-full bg-[conic-gradient(#4f46e5_0_78%,#e2e8f0_78%_100%)]">
                                <div class="flex size-20 flex-col items-center justify-center rounded-full bg-white">
                                    <span class="text-3xl font-bold text-slate-950">78</span>
                                    <span class="text-xs text-slate-400">SEO score</span>
                                </div>
                            </div>
                            <span class="mt-4 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Good foundation</span>
                        </div>

                        <div class="space-y-3">
                            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Top opportunities</p>
                            <div class="rounded-xl border border-slate-100 p-4">
                                <div class="mb-2 flex items-center justify-between text-sm">
                                    <span class="font-semibold text-slate-700">Page titles</span>
                                    <span class="font-semibold text-amber-600">Needs work</span>
                                </div>
                                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div class="h-full w-3/5 rounded-full bg-amber-400"></div>
                                </div>
                            </div>
                            <div class="rounded-xl border border-slate-100 p-4">
                                <div class="mb-2 flex items-center justify-between text-sm">
                                    <span class="font-semibold text-slate-700">Content quality</span>
                                    <span class="font-semibold text-emerald-600">Strong</span>
                                </div>
                                <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div class="h-full w-4/5 rounded-full bg-emerald-500"></div>
                                </div>
                            </div>
                            <div class="rounded-xl border border-slate-100 p-4">
                                <p class="text-sm font-semibold text-slate-700">Next recommended action</p>
                                <p class="mt-1 text-xs leading-5 text-slate-500">Rewrite 3 page titles to better match search intent.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>
