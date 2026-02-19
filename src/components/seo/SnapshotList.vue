
<script setup>
  // Imports
  import { ref, computed, onBeforeMount, onMounted, watch, reactive } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import BaseSpinner from '../UI/BaseSpinner.vue';
  import BaseModal from '../UI/BaseModal.vue';
  import SnapshotItem from './SnapshotItem.vue';
  import SnapshotForm from './SnapshotForm.vue';
  import { TrashIcon, PlusCircleIcon, EyeIcon, PencilSquareIcon, ArrowPathIcon, XCircleIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid';
  import SnapshotModal from './SnapshotModal.vue';

  // Variables
  const route = useRoute();

  const store = useStore();
  const toggle = ref(false);
  let titles = ref([
    {
        id: 1,
        name: 'Title',
        style: 'pl-6 py-3 text-left font-semibold text-slate-700'
    },
    {
        id: 2,
        name: 'Score',
        style: 'px-2 py-3 text-center font-semibold text-slate-700'
    },
    {
        id: 3,
        name: 'Word Count',
        style: 'px-2 py-3 text-center font-semibold text-slate-700'
    },
    {
        id: 4,
        name: 'Status',
        style: 'px-2 py-3 text-center font-semibold text-slate-700'
    },
    {
        id: 5,
        name: 'Actions',
        style: 'px-2 py-3 text-center font-semibold text-slate-700'
    }
  ]);
  const form = reactive({
    url: '',
    desc: ''
  });
  const fields = [
    {
      key: 'url',
      placeholder: 'https://example.com',
      type: 'url',
      label: 'URL'
    },
    {
      key: 'desc',
      placeholder: 'Blog, Portfolio, etc...',
      type: 'text',
      label: 'Description'
    }
  ];

  // const currentSnapshot = ref(0);
  const sites = computed(() => store.getters.getSites);
  const totalSnapshots = computed(() => {
    return sites.value ? sites.value.length : 0;
  });

  // const site = computed(() => {
  //   if (!sites.value || sites.value.length === 0) return null;
  //   return sites.value[currentSnapshot.value];
  // });
  const isLoading = computed(() => store.getters.getIsLoading);

  var pageSize = ref(10);
  var pageNumber = ref(1);
  var from = computed(() => (pageSize.value * (pageNumber.value - 1)) + 1);
  var to = computed (() => {
    if (!sites.value || sites.value.length === 0) return 0;
    else {
      return (pageSize.value * pageNumber.value) > totalSnapshots.value ? sites.value.length : pageNumber.value * pageSize.value;

    }
  });

  const paginatedSites = computed(() => {
    if (!sites.value || sites.value.length === 0) return [];

    const start = (pageNumber.value - 1) * pageSize.value;
    const end = start + pageSize.value;

    return sites.value.slice(start, end);
  });

  const prevPageDisabled = computed(() => pageNumber.value === 1);

  const nextPageDisabled = computed(() => {
    if (!sites.value) return true;
    const maxPages = Math.ceil(sites.value.length / pageSize.value);
    return pageNumber.value === maxPages;
  });



  // Functions 
  function toggleModal() {
    toggle.value = !toggle.value
    toggle.value == true ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
  }
  
  async function handleAnalyze() {
    toggle.value = false;
    await store.dispatch('analyzeSite', {
      siteUrl: form.url,
      siteType: form.desc
    });
    form.url = '',
    form.desc = ''
  }

  async function fetchSnapshots() {
    await store.dispatch('fetchAllSnapshots');
  }

  function startPolling(snapshotId) {
      const interval = setInterval(async () => {
        const processing = sites.value.filter(s => s.status !== 'Complete' || s.status !== 'complete');
        await store.dispatch('fetchSnapshotById', { id: snapshotId });

          // stop polling once suggestions exist
          const updatedSite = sites.value.find(s => s.id === snapshotId);
          if (updatedSite && updatedSite.suggestions) {
              clearInterval(interval);
          }
      }, 5000);
  }

  function prevSnapshot() {
    if (pageNumber.value > 1) {
      pageNumber.value--;
    }
  }


  function nextSnapshot() {
    const maxPages = Math.ceil(sites.value.length / pageSize.value);
    if (pageNumber.value < maxPages) {
      pageNumber.value++;
    }
  }


  function closeForm() {
    toggle.value = false;
  }

  // Hooks
  onMounted(() => {
    //Load sites
    if(!sites.value || sites.value.length == 0) {
      fetchSnapshots();
    }
  });

</script>

<template>
    <base-layout>
        <template #header>
            <span class="text-blue-800 orbitron-bold text-lg">SEO Snapshot</span>
        </template>
        <section>
          <base-card class="orbitron-regular text-left z-40 max-h-full overflow-x-auto">
          <!-- Toolbar -->
              <div class="w-full flex justify-start lg:justify-end items-center mb-8 transition-all duration-400 ease-in-out">
                  <base-button
                      @click="toggleModal"
                      class="border-none bg-indigo-400 hover:bg-indigo-700 text-white font-normal text-sm py-3"
                  >
                  <plus-circle-icon class="size-6" />
                  <span class="ml-2">New Snapshot</span>
                  </base-button>
              </div>
              <div class="w-full overflow-x-auto sm:overflow-x-visible" v-if="!isLoading">
                  <!-- Table -->
                  <table class="w-full table-fixed border-separate border-spacing-0 overflow-x-auto min-w-3xl">
                      <!-- Table layout -->
                      <colgroup>
                          <col style="width:40%" />
                          <col style="width:15%" />
                          <col style="width:15%" />
                          <col style="width:15%" />
                          <col style="width:15%" />
                      </colgroup>
                      <thead class="w-full border-b border-blue-200">
                          <tr role="row">
                              <th v-for="item in titles" :key="item.id" class="text-sm md:text-md text-" :class="item.style">{{ item.name }}</th>
                          </tr>
                      </thead>
                      <tbody class="w-full rounded-bl-lg rounded-br-lg p-4">
                          <tr role="row" v-for="site in paginatedSites" :key="site.id" class="w-full py-4 text-sm text-left hover:bg-indigo-100 transition duration-200 ease-in-out cursor-pointer">
                              <td role="cell" class="px-6 py-4 align-middle text-slate-800 text-ellipsis text-zinc-600 truncate font-semibold">
                                {{ site.title }}
                              </td>
                              <td role="cell" class="px-6 py-4 align-middle text-center text-slate-700">
                                <span class="rounded-lg bg-white text-green-500 border border-green-400 px-4 py-3" :class="{ 'border-red-400 text-red-400' : site.score < 60, 'border-indigo-500' : site.status == 'Pending'}">
                                  {{ site.score || 'Pending' }}
                                </span>
                              </td>
                              <td role="cell" class="px-6 py-4 align-middle text-center text-slate-700">
                                {{ site.wordCount }}
                              </td>
                              <td role="cell" class="px-6 py-4 align-middle text-center font-semibold text-md">
                                <span class="rounded-lg border border-green-500 text-green-500 bg-white px-4 py-3" :class="{ 'border-indigo-500 text-indigo-500' : site.status == 'Pending'}">
                                  {{ site.status }}
                                </span>
                              </td>
                              <td role="cell" class="py-4 text-center flex justify-center items-center gap-2">
                                <router-link :to="{ name: 'snapshot-item', params: { id: site.id } }">
                                  <span class="cursor-pointer">
                                      <span class="hidden">View</span>
                                      <eye-icon class="size-6 text-zinc-400 hover:text-zinc-600 transition duration-400 ease-in-out" />
                                  </span>
                                </router-link>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <div class="w-full mt-4 flex justify-between items-center text-sm border-t border-indigo-100 pt-6">
                    <div class="flex items-center justify-center">
                      <button :disabled="prevPageDisabled" @click="prevSnapshot" class="p-2 hover:bg-indigo-400 transition duration-300 ease-in-out cursor-pointer rounded-md disabled:bg-transparent disabled:hover:bg-transparent disabled:text-gray-300" :class="{'bg-transparent hover:bg-transparent text-gray-300' : prevPageDisabled}">
                        <ChevronLeftIcon class="size-5" />
                        <span class="hidden">
                          Prev
                        </span>
                      </button>
                      <span class="mx-6 leading-relaxed">{{ pageNumber }}</span>
                      <button :disabled="nextPageDisabled" @click="nextSnapshot" class="p-2 hover:bg-indigo-400 transition duration-300 ease-in-out cursor-pointer rounded-md" :class="{'bg-transparent hover:bg-transparent text-gray-300' : nextPageDisabled}">
                        <ChevronRightIcon class="size-5" />
                        <span class="hidden">Next</span>
                      </button>
                    </div>
                    <div>{{ from }} to {{ to }} of {{ totalSnapshots }} Results</div>
                  </div>
              </div>
              <base-spinner v-else />
          </base-card>
        </section>
        <div v-if="toggle" class="fixed inset-0 w-full h-screen top-13 left-0 overflow-none after:bg-indigo-400 after:w-full after:absolute after:top-0 after:left:0 after:h-screen after:opacity-90 absolute:overflow-none after:z-10 flex justify-center items-center">
          <snapshot-modal class="w-2xl z-20 bg-zinc-50 py-12 px-8">
              <div class="flex justify-between items-center flex-nowrap border-b border-blue-400 pb-6 mb-8">
                <h3 class="orbitron-bold text-2xl text-blue-600 w-full">New Snapshot</h3>
                <button @click="toggleModal">
                  <XCircleIcon class="size-8 hover:text-blue-700 text-blue-300 cursor-pointer transition ease-in-out duration-300" />
                </button>
              </div>
              <SnapshotForm
                :form="form"
                :fields="fields"
                @analyze="handleAnalyze"
                @closeForm="handleCloseForm"
              />
          </snapshot-modal>
        </div>
        <router-view />
    </base-layout>
</template>

