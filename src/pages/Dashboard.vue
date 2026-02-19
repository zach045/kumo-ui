<script setup>
    import { useStore } from 'vuex';
    import { computed } from 'vue';
    import DoughnutChart from '../components/charts/Doughnut.vue';
    import BaseSectionCard from '../components/UI/BaseSectionCard.vue';
    import BaseBanner from '../components/UI/BaseBanner.vue';
    import { CameraIcon, PencilSquareIcon, ExclamationTriangleIcon, BellAlertIcon } from '@heroicons/vue/24/solid';
    import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
    import { Square2StackIcon } from '@heroicons/vue/24/outline';
    import { copyToClipboard } from '../utils/copyData';
    
    //Variables
    const store = useStore();
    const insights = computed(() => store.getters.getInsights);
    const lastSnapshot = computed(() => insights.value?.lastSnapshot);
    const chartLabels = ['Average Score', 'Remaining'];
    const chartColors = ['#6e73ff', '#E5E7EB']; // blue + light gray
    const chartTitle = 'Average Snapshot Score'
    const suggestions = computed(() => {
    if(!lastSnapshot.value || !lastSnapshot.value.suggestions) return [];

    return [
        {
            label: 'Improved Title',
            value: lastSnapshot.value.suggestions.improved_title,
            variant: 'lightBlue'
        },
        {
            label: 'Meta Description',
            value: lastSnapshot.value.suggestions.improved_description,
            variant: 'blue'
        },
        {
            label: 'Suggested H1 tag',
            value: lastSnapshot.value.suggestions.suggested_h1,
            variant: 'green'
        }
    ]
    });

    const formattedDate = computed(() => {
        if(!lastSnapshot.value?.createdAt) return '-';
        return lastSnapshot.value.createdAt.substring(0,10);
    });

    const gridItems = computed(() => {
        if (!lastSnapshot.value) return [];

        return [
            { label: 'Industry', value: lastSnapshot.value.suggestions?.industry ?? '—' },
            { label: 'Word Count', value: lastSnapshot.value.wordCount },
            { label: 'Created', value: formattedDate.value },
            { label: 'Score', value: `${lastSnapshot.value.score} / 100` }
        ];
    });

    const chartData = computed(() => {
    if (!insights.value || insights.value.scoreAverage == null) {
        return [0, 100];
    }

    const score = Math.round(insights.value.scoreAverage);
    return [score, Math.max(0, 100 - score)];
    });

    const tileData = computed(() => {
        if (!insights.value) return [];

        return [
            {
            key: "Total Snapshots:",
            value: insights.value.snapshotCount ?? "—"
            },
            {
            key: "Word Count Average:",
            value: insights.value.wordCountAverage ?? "—"
            }
        ];
    });

    //Bg Variants
    const darkBlue = 'darkBlue';
    const lightGray = 'lightGray';
    const white = 'white';
    const indigoGradient = 'indigoGradient';
    const lightBlue = 'lightBlue';


</script>

<template>
    <section>
        <base-layout class="top-0">
            <template #header>
                <span class="text-blue-800 orbitron-bold text-lg">Dashboard</span>
            </template>
            <div class="w-full h-full">
                <!-- Guard against null while loading -->
                <div v-if="insights" class="grid grid-cols">
                    <div class="grid grid-cols lg:grid-cols-4 lg:gap-4 items-center lg:justify-between">
                        <base-card class="col-span-1 lg:col-span-2 bg-gray-50 flex justify-center items-center">
                            <div>
                                <DoughnutChart
                                :data="chartData"
                                :labels="chartLabels"
                                :colors="chartColors"
                                :chart-title="chartTitle"
                                />
                            </div>
                        </base-card>
                        <base-card v-for="data in tileData" :key="data.key" class="p-0! bg-linear-to-t from-indigo-100 to-indigo-500 text-white flex justify-center items-center h-fill-avail min-h-48">
                            <div class="flex justify-center items-center">
                                <div class="flex flex-col items-center justify-center orbitron-regular text-center">
                                    <span class="mb-8 orbitron-bold">{{ data.key }}</span>
                                    <span class="flex flex-col items-center justify-center rounded-full w-16 h-16 text-indigo-800 bg-white shadow-inner shadow-indigo-800">{{ data.value }}</span>
                                </div>
                            </div>
                        </base-card>
                    </div>
                    <base-section-card 
                        v-if="lastSnapshot" 
                        :headerBgVariant="indigoGradient"
                        :body-bg-variant="lightGray"
                        class="p-0!">
                        <template #header>
                            <h3 class="text-green-400 text-xl orbitron-bold flex items-center animate-pulse">
                                <span>
                                    <BellAlertIcon class="size-5 mr-3" />
                                </span>
                                <span>Newest Snapshot</span>
                            </h3>
                            <span class="text-gray-100 italic">Insights from your latest submission</span>
                        </template>
                        <template #body>
                            <div class="grid grid-cols gap-4">
                                <base-card class="col-span-3 xl:col-span-2 bg-gray-50 text-left text-indigo-800 row-span-2 orbitron-regular">
                                    <div class="flex justify-between items-center">
                                        <span>Page Title</span>
                                        <span class="px-4 py-2 rounded-full bg-green-200 text-sm text-green-600 orbitron-bold">{{ lastSnapshot.status }}</span>
                                    </div>
                                    <h3 class="text-xl my-8 orbitron-bold">{{ lastSnapshot.title }}</h3>
                                    <hr />
                                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 orbitron-bold text-gray-700">
                                        <span v-for="item in gridItems" :key="item.label">{{ item.label }}</span>
                                    </div>
                                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 text-sm text-gray-700">
                                        <span v-for="item in gridItems" :key="item.value">{{ item.value }}</span>
                                    </div>
                                </base-card>
                            </div>
                            <div class="text-md mt-8">
                                <base-banner v-for="suggestion in suggestions" :key="`${lastSnapshot.id}-${suggestion.label}`" :variant="suggestion.variant">
                                <template #label>{{ suggestion.label }}</template>
                                <template #actions>
                                    <button @click="copyToClipboard(suggestion.value)" class="cursor-pointer transtion-all duration-200 p-1 rounded-md hover:scale-115 hover:bg-gray-100">
                                        <span class="hidden">copy</span>
                                        <Square2StackIcon class="size-4" />
                                    </button>
                                </template>
                                <template #input>
                                <span>
                                        {{ suggestion.value }}
                                </span> 
                                </template>
                            </base-banner>
                            <div class="gap-2 py-4">
                                <span class="flex gap-2">Recommended Keywords</span>
                                <div class="flex flex-wrap gap-3 py-4">
                                    <span v-for="keyword in lastSnapshot.suggestions.long_tail_keywords" :key="`${lastSnapshot.id}-${keyword}`" class="rounded-full px-4 py-1 bg-indigo-200 text-blue-800">
                                        {{ keyword }}
                                    </span>
                                </div>
                            </div>
                            <div class="gap-2" v-if="lastSnapshot.issues.length > 0">
                            <span class="flex gap-2">SEO Issues & Recommendations</span>
                            <div class="flex flex-wrap gap-3 py-4">
                                <span v-for="issue in lastSnapshot.issues" :key="`${lastSnapshot.id}-${issue}`" class="rounded-full px-4 py-1 bg-red-400 text-black flex items-center">
                                    <span>
                                        <ExclamationCircleIcon class="size-5 mr-2" />
                                    </span>
                                    <span>
                                        {{ issue }}
                                    </span>
                                </span>
                            </div>
                        </div>
                            </div>
                        </template>
                    </base-section-card>
                </div>

                <div v-else>
                <!-- Simple loading/empty state -->
                <span class="text-sm text-gray-500">No insights yet. Run your first snapshot to see dashboard data.</span>
                </div>
            </div>
        </base-layout>
    </section>
</template>
