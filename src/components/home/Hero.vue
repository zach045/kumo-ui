<script setup>
    // Imports 
    import { ArrowRightCircleIcon, BoltIcon } from '@heroicons/vue/24/solid';
    import BaseButton from '../UI/BaseButton.vue';
</script>

<template>
    <section class="max-w-screen h-[calc(100vh_-_64px)] md:mt-16 bg-linear-to-b from-sky-100 to-indigo-500">
            <div class="max-w-7xl w-full mx-auto px-4 xl:px-0 py-16 h-full grid grid-cols md:grid-cols-3">
                <div class="my-auto p-8 col-span-2">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-700 to-indigo-900 bg-clip-text text-transparent leading-tight flex flex-wrap items-center flex">
                        <span class="flex items-center flex-wrap">
                            Supercharge 
                            <span class="flex items-center flex-nowrap">
                                Your
                                <BoltIcon class="size-12 text-green-200 ml-2" />
                            </span>
                        </span>
                        <span>SEO with 
                            <span class="bungee-shade-regular text-indigo-700">KUMO</span>
                        </span>
                    </h1>
                    <h2 class="text-indigo-50 text-sm md:text-xl my-6 italic">
                        Discover powerful insights, optimize your content, and dominate search rankings with our intelligent SEO platform
                    </h2>
                    <base-button class="bg-white hover:shadow-lg hover:scale-105 shadow-indigo-300 border-none transition-all duration-300 ease-in-out group">
                        <span>Get Started</span>
                        <ArrowRightCircleIcon class="size-5 text-indigo-500 ml-1 group-hover:ml-2 group-hover:text-white transition-all ease-in-out" />
                    </base-button>
                </div>
            </div>
        </section>
</template>
