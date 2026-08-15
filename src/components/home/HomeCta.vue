<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const user = computed(() => store.getters.getUser);
const destination = computed(() => ({ name: user.value ? 'dashboard' : 'signup' }));
</script>

<template>
    <section class="bg-white px-6 py-24 sm:py-28">
        <div class="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-16 text-center shadow-2xl shadow-indigo-200 sm:px-12">
            <div class="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-sky-300/20 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-28 -right-12 size-80 rounded-full bg-violet-300/20 blur-3xl"></div>

            <div class="relative mx-auto max-w-2xl">
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-indigo-100">Your next improvement starts here</p>
                <h2 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Stop guessing what your website needs.
                </h2>
                <p class="mt-5 text-lg leading-8 text-indigo-100">
                    Run your first analysis and turn your website’s SEO data into a clear, practical path forward.
                </p>
                <router-link
                    :to="destination"
                    class="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
                >
                    {{ user ? 'Return to Dashboard' : 'Analyze Your Website' }}
                    <ArrowRightIcon class="size-4" />
                </router-link>
            </div>
        </div>
    </section>
</template>
