<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/solid';

const steps = [
    {
        number: '01',
        title: 'Enter your website',
        description: 'Add the URL you want Kumo to analyze. No complicated setup or lengthy configuration.',
    },
    {
        number: '02',
        title: 'Understand the results',
        description: 'Review your score, page findings, and the SEO signals helping or limiting your visibility.',
    },
    {
        number: '03',
        title: 'Improve with direction',
        description: 'Work through prioritized recommendations and create a stronger foundation for organic growth.',
    },
];
</script>

<template>
    <section id="how-it-works" class="scroll-mt-20 bg-slate-950 px-6 py-24 text-white sm:py-28">
        <div class="mx-auto max-w-7xl">
            <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div class="max-w-xl">
                    <p class="text-sm font-bold uppercase tracking-[0.18em] text-sky-400">How Kumo works</p>
                    <h2 class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        From website URL to a focused plan.
                    </h2>
                    <p class="mt-5 text-lg leading-8 text-slate-300">
                        A straightforward workflow designed to help you spend less time interpreting reports and more time improving your site.
                    </p>
                </div>

                <div class="grid gap-5 md:grid-cols-3">
                    <article
                        v-for="(step, index) in steps"
                        :key="step.number"
                        class="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold text-sky-400">{{ step.number }}</span>
                            <ArrowRightIcon v-if="index < steps.length - 1" class="hidden size-4 text-slate-600 md:block" />
                        </div>
                        <h3 class="mt-8 text-lg font-bold">{{ step.title }}</h3>
                        <p class="mt-3 text-sm leading-6 text-slate-400">{{ step.description }}</p>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>
