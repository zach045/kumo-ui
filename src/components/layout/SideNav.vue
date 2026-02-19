<template>
    <header :class="[
        'h-screen bg-linear-to-b from-sky-100 to-indigo-500 top-0 hover:w-[250px] transition-all duration-300 group-hover:transition-all group-hover:duration-300 ease-in-out group',
        collapsed ? 'w-[80px]' : 'w-[250px]'
    ]">
        <nav class="h-full w-full flex flex-col justify-between items-start pt-2">
            <div class="text-5xl w-full flex justify-center flex-col items-start text-left">
                <router-link to="/dashboard" class="bungee-shade-regular uppercase pl-5 text-blue-800">K</router-link>
                <button
                    @click="toggleCollapsed"
                    class="cursor-pointer p-1 rounded hover:bg-indigo-800 transition flex justify-center items-center mt-6 ml-5 hover:text-white text-blue-800"
                    title="Collapse sidebar"
                >
                    <!-- 🔹 ensure the icon is used directly, not inside <component> -->
                    <ChevronDoubleLeftIcon
                        class="w-5 h-5 transition-transform duration-300"
                        :class="{'rotate-180': collapsed }"
                    />
                </button>
                <div class="w-full mt-10 text-blue-800">
                    <h2 class="mb-6 text-sm font-bold text-left pl-5">
                        <span class="group-hover:block" :class="{'hidden' : collapsed}">Modules</span>
                    </h2>
                    <ul>
                        <li v-for="route in routes" :key="route.name" class="w-full flex hover:bg-indigo-800 hover:text-white transition duration-300 ease-in-out">
                            <router-link :to="{ name: route.name }" class="w-full h-full text-sm flex items-center justify-start gap-2 font-semibold py-4 pl-6"
                            exact>
                                <component
                                    v-if="route.icon"
                                    :is="route.icon"
                                    class="size-5 flex-shrink-0"
                                />
                                <span class="group-hover:block" :class="{'hidden' : collapsed}">
                                    {{ route.title }}
                                </span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="w-full mt-10 text-white flex align-bottom">
                <button @click="signOut" class="w-full h-full cursor-pointer pl-8 py-4 flex items-center justify-start text-sm gap-2 font-semibold transition duration-300 ease-in-out hover:bg-indigo-800">
                        <PowerIcon class="size-5 flex-shrink-0" />
                        <span class="group-hover:opacity-100 group-hover:transition group-hover:duration-400" :class="{'opacity-0' : collapsed }">Sign Out</span>
                </button>
            </div>
        </nav>
    </header>
</template>

<script setup>
    // Imports
    import { computed, ref } from 'vue';
    import { Square2StackIcon, CameraIcon, ChevronDoubleLeftIcon, PowerIcon } from '@heroicons/vue/24/solid';
    import { useStore } from 'vuex';

    // Variables
    const store = useStore();
    const routes = ref([
        {
            title: 'Dashboard',
            name: 'dashboard',
            dest: '/dashboard',
            icon: Square2StackIcon
        },
        {
            title: 'Snapshots',
            name: 'seo-snapshot',
            dest: '/seo-snapshot',
            icon: CameraIcon
        },
        /*{
            title: 'Keywords',
            name: 'keywords',
            dest: '/keywords'
        }*/
    ])
    const collapsed = computed(() => store.getters.getCollapsed);

    // Functions 
    function toggleCollapsed() {
        store.dispatch('toggleCollapsed');
    }

    // Functions
    function signOut() {
        store.dispatch('logout');
    }
</script>