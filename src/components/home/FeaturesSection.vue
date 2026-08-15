<script setup>
import {
    ChartBarSquareIcon,
    LightBulbIcon,
    MagnifyingGlassCircleIcon,
} from '@heroicons/vue/24/outline';

const features = [
    {
        icon: MagnifyingGlassCircleIcon,
        eyebrow: 'Website analysis',
        title: 'See the full SEO picture',
        description: 'Scan the signals that shape search performance and bring technical, content, and on-page findings into one clear view.',
        accent: 'bg-sky-50 text-sky-600',
    },
    {
        icon: ChartBarSquareIcon,
        eyebrow: 'Clear scoring',
        title: 'Know what needs attention',
        description: 'Turn a dense audit into an understandable score with page-level insights that make strengths and gaps easy to recognize.',
        accent: 'bg-indigo-50 text-indigo-600',
    },
    {
        icon: LightBulbIcon,
        eyebrow: 'Prioritized guidance',
        title: 'Move from insight to action',
        description: 'Get focused recommendations in the order they matter, so your next SEO decision is based on impact—not guesswork.',
        accent: 'bg-violet-50 text-violet-600',
    },
];
</script>

<template>
    <section id="features" class="scroll-mt-20 bg-white px-6 py-24 sm:py-28">
        <div class="mx-auto max-w-7xl">
            <div class="max-w-2xl">
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Built for clarity</p>
                <h2 class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Everything you need to make smarter SEO decisions.
                </h2>
                <p class="mt-5 text-lg leading-8 text-slate-600">
                    Kumo simplifies the audit process without watering it down, giving you useful answers instead of another wall of data.
                </p>
            </div>

            <div class="mt-14 grid gap-6 lg:grid-cols-3">
                <article
                    v-for="feature in features"
                    :key="feature.title"
                    class="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
                >
                    <div :class="['flex size-12 items-center justify-center rounded-xl', feature.accent]">
                        <component :is="feature.icon" class="size-6" />
                    </div>
                    <p class="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{{ feature.eyebrow }}</p>
                    <h3 class="mt-2 text-xl font-bold text-slate-950">{{ feature.title }}</h3>
                    <p class="mt-3 leading-7 text-slate-600">{{ feature.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>
