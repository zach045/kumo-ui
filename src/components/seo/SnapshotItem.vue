<script setup>
import { onBeforeMount, ref } from 'vue';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BaseModal from '../UI/BaseModal.vue';
import BaseCard from '../UI/BaseCard.vue';
import BaseSectionCard from '../UI/BaseSectionCard.vue';
import DoughnutChart from '../charts/Doughnut.vue';
import BaseSpinner from '../UI/BaseSpinner.vue';
import BaseBanner from '../UI/BaseBanner.vue';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid';
import { Square2StackIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { copyToClipboard } from '../../utils/copyData';

// Variables
const route = useRoute();
const router = useRouter();
const store = useStore();

const snapshotId = computed(() => Number(route.params.id));

const snapshot = computed(() =>
  store.getters.getSelectedSnapshot
);

const formattedDate = computed(() => {
   if(!snapshot.value?.createdAt) return '-';
   return snapshot.value.createdAt.substring(0,10);
});

const gridItems = computed(() => {
  if (!snapshot.value) return [];

  return [
    { label: 'Industry', value: snapshot.value.suggestions?.industry ?? '—' },
    { label: 'Word Count', value: snapshot.value.wordCount },
    { label: 'Created', value: formattedDate.value },
    { label: 'Score', value: `${snapshot.value.score} / 100` }
  ];
});

var toggle = ref(false);


// Chart variables
const chartLabels = ['Site Score', 'Remaining'];
const chartColors = ['#6e73ff', '#E5E7EB']; // blue + light gray
const chartTitle = 'SEO Snapshot Score';
const chartData = computed(() => {
  if (!snapshot.value || snapshot.value.score == null) {
    return [0, 100];
  }

  const score = Math.round(snapshot.value.score);
  return [score, Math.max(0, 100 - score)];
});

// AI Suggestions 
const aiSuggestions = computed(() => {
    if(!snapshot.value || !snapshot.value.suggestions) return [];

    return [
        {
            label: 'Improved Title',
            value: snapshot.value.suggestions.improved_title,
            variant: 'lightBlue'
        },
        {
            label: 'Meta Description',
            value: snapshot.value.suggestions.improved_description,
            variant: 'blue'
        },
        {
            label: 'Suggested H1 tag',
            value: snapshot.value.suggestions.suggested_h1,
            variant: 'green'
        }
    ]
});

//Bg Variants
const darkBlue = 'darkBlue';
const lightGray = 'lightGray';
const white = 'white';
const indigoGradient = 'indigoGradient';

console.log(snapshot);

//  Fetch snapshot when component mounts
onBeforeMount(async () => {
  if (!store.state.selectedSnapshot || store.state.selectedSnapshot.id !== snapshotId.value) {
    await store.dispatch('fetchSnapshotById', { id: snapshotId.value });
    console.log(snapshot.value.score);
  }
});

// Functions 

/* Delete Snapshot */
async function deleteSnapshot(id) {
    try {
        await store.dispatch('deleteSnapshot', { snapId: id });
        toggleDeleteModal();
        router.push("seo-snapshot");
    } catch(err) {
        console.error("Delete failed:", err)
    }
}

/* Toggle Confirm Delete */
function toggleDeleteModal() {
    toggle.value = !toggle.value
    toggle.value == true ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
}

</script>


<template>
    <base-layout class="bg-gradient-to-b from-sky-50 via-blue-200 to-indigo-400 mb-0">
        <template #header>
            <span class="text-blue-800 orbitron-bold text-lg">Snapshot Details</span>
        </template>
        <section v-if="snapshot && snapshot.id">
            <div class="flex justify-between items-center mt-8 text-sm">
                <button @click="$router.back()" class="flex flex-nowrap items-center group transition-all duration-300 ease-in-out cursor-pointer text-gray-900">
                    <ArrowLeftIcon class="size-4" />
                    <span class="pl-1 group-hover:pl-3 transition-all duration-300 ease-in-out">Back to Snapshots</span> 
                </button>
                <span class="flex items-center flex-nowrap text-indigo-500 group">
                    <a 
                        :href="snapshot.url" 
                        target="_blank"
                        rel="noopener noreferrer" 
                        class="text-white flex items-center transition duration-300 ease-in-out rounded-md p-3 bg-blue-500 hover:bg-blue-700"
                    >
                        Visit Site
                        <span>
                            <ArrowTopRightOnSquareIcon class="size-4 ml-2" />
                        </span>
                    </a>
                </span>
            </div>
            <div class="grid grid-cols xl:grid-cols-3 gap-4">
                <base-card class="col-span-3 xl:col-span-1 bg-gray-50 row-span-2 flex justify-center items-center">
                    <div>
                        <DoughnutChart
                        :data="chartData"
                        :labels="chartLabels"
                        :colors="chartColors"
                        :chart-title="chartTitle"
                        />
                    </div>
                </base-card>
                <base-card class="col-span-3 xl:col-span-2 bg-gray-50 text-left text-indigo-800 row-span-2 orbitron-regular">
                    <div class="flex justify-between items-center">
                        <span>Page Title</span>
                        <span class="px-4 py-2 rounded-full bg-green-200 text-sm text-green-600 orbitron-bold">{{ snapshot.status }}</span>
                    </div>
                    <h3 class="text-xl my-8 orbitron-bold">{{ snapshot.title }}</h3>
                    <hr />
                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 orbitron-bold text-gray-700">
                        <span v-for="item in gridItems" :key="item.label">{{ item.label }}</span>
                    </div>
                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 text-sm text-gray-700">
                        <span v-for="item in gridItems" :key="item.value">{{ item.value }}</span>
                    </div>
                </base-card>
            </div>
            <div>
                <base-section-card class="bg-white p-0! shadow-md shadow-white" :headerBgVariant="indigoGradient" :bodyBgVariant="lightGray">
                    <template #header>
                        <h3 class="text-sky-400 text-xl orbitron-bold">AI Suggestions</h3>
                        <span class="text-gray-300">Recommendations to improve your SEO ranking</span>
                    </template>
                    <template #body>
                        <base-banner v-for="suggestion in aiSuggestions" :key="`${snapshot.id}-${suggestion.label}`" :variant="suggestion.variant">
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
                                <span v-for="keyword in snapshot.suggestions.long_tail_keywords" :key="`${snapshot.id}-${keyword}`" class="rounded-full px-4 py-1 bg-indigo-200 text-blue-800">
                                    {{ keyword }}
                                </span>
                            </div>
                        </div>
                        <div class="gap-2" v-if="snapshot.issues.length > 0">
                            <span class="flex gap-2">SEO Issues & Recommendations</span>
                            <div class="flex flex-wrap gap-3 py-4">
                                <span v-for="issue in snapshot.issues" :key="`${snapshot.id}-${issue}`" class="rounded-full px-4 py-1 bg-red-400 text-black flex items-center">
                                    <span>
                                        <ExclamationCircleIcon class="size-5 mr-2" />
                                    </span>
                                    <span>
                                        {{ issue }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </template>
                </base-section-card>
                <div class="flex justify-end items-center">
                    <button @click="toggleDeleteModal()" class="text-white flex items-center transition duration-300 ease-in-out rounded-md p-3 bg-red-500 hover:bg-red-700 cursor-pointer mb-8">
                        <span>Delete</span>
                        <TrashIcon class="size-4 ml-1" />
                    </button>
                </div>
            </div>
            <div v-if="toggle" class="fixed inset-0 w-full h-screen z-50 overflow-none after:bg-indigo-400 after:w-full after:absolute after:top-0 after:left:0 after:h-screen after:opacity-90 absolute:overflow-none after:z-10 flex justify-center items-center">
                <snapshot-modal class="w-2xl z-20 bg-zinc-50 py-12 px-8 rounded">
                    <div class="flex justify-between items-center flex-nowrap border-b border-blue-400 pb-6 mb-8">
                        <h3 class="orbitron-bold text-2xl text-blue-600 w-full">Are you sure you want to delete this snapshot?</h3>
                        <button @click="toggleModal">
                        <XCircleIcon class="size-8 hover:text-blue-700 text-blue-300 cursor-pointer transition ease-in-out duration-300" />
                        </button>
                    </div>
                    <button @click="toggleDeleteModal" class="px-4 py-2 bg-gray-800 hover:bg-gray-500 text-white rounded cursor-pointer">No</button>
                    <button @click="deleteSnapshot(snapshot.id)" class="px-4 py-2 bg-red-800 hover:bg-red-500 text-white ml-8 rounded cursor-pointer">Yes</button>
                </snapshot-modal>
            </div>
        </section>
        <section class="h-full" v-else>
            <base-card class="h-fill-avail flex justify-center items-center">
                <base-spinner />
            </base-card>
        </section>
    </base-layout>
</template>