<script setup>
    // Imports
    import { useStore } from 'vuex';
    import { computed } from 'vue';
    import SideNav from './SideNav.vue';
    import MobileNav from './MobileNav.vue';
    import { UserCircleIcon } from '@heroicons/vue/24/solid';

    // Variables
    const store = useStore();
    const user = computed(() => store.getters.getUser);
    const collapsed = computed(() => store.getters.getCollapsed);
</script>

<template>
    <div class="flex top-0 transiion-all duration-300 ease-in-out relative w-full">
        <div class="hidden lg:flex h-full bg-white shadow-md sticky left-0 top-0 z-50">
            <SideNav />
        </div>
        <section class="flex flex-col h-full justify-start items-start w-full">
            <div class="hidden lg:flex flex-wrap top-0 justify-between items-center px-8 py-4 w-full shadow-lg shadow-blue-200 bg-white">
                <div>
                    <slot name="header">
                        <span class="text-blue-800">Untitled Page</span>
                    </slot>
                </div>
                <div class="flex items-center justify-center text-blue-800 text-sm">
                    <h2 v-if="user && user.name" class="text-blue-800 orbitron-regular">
                        <span>Hi, {{ user.name }}</span>
                    </h2>
                    <span>
                        <UserCircleIcon class="size-5 ml-3" />
                    </span>
                </div>
            </div>
            <div class="lg:hidden flex flex-nowrap w-full">
                <mobile-nav />
            </div>
            <div class="h-full px-8 w-full">
                <slot>
                    <base-card class="w-full h-full">
                        <div class="text-slate-700">
                            No content provided.
                        </div>
                    </base-card>
                </slot>
            </div>
        </section>
    </div>
</template>

<style scoped>
.custom-w {
    width: calc(100vw - 250px);
    margin-left:auto;
}

.custom-collapsed-w {
    width: calc(100vw - 80px);
    margin-left:auto;
}
</style>