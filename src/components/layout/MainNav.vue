<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { UserCircleIcon } from '@heroicons/vue/24/solid';
import BaseButton from '../UI/BaseButton.vue';

const items = [
    { name: 'Features', link: '#features' },
    { name: 'How It Works', link: '#how-it-works' },
];

const store = useStore();
const user = computed(() => store.getters.getUser);
</script>

<template>
    <header class="absolute left-0 top-0 z-20 flex w-full justify-center">
        <nav class="flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
            <router-link
                to="/"
                class="bungee-shade-regular text-4xl text-indigo-700 transition-colors hover:text-indigo-900"
            >
                Kumo
            </router-link>

            <div class="orbitron-regular flex items-center gap-2">
                <ul class="mr-3 flex items-center">
                    <li v-for="item in items" :key="item.name">
                        <a
                            :href="item.link"
                            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-indigo-700"
                        >
                            {{ item.name }}
                        </a>
                    </li>
                </ul>

                <template v-if="user">
                    <router-link :to="{ name: 'dashboard' }">
                        <BaseButton class="border-none bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">
                            <UserCircleIcon class="mr-1 size-4" />
                            {{ user.name }}
                        </BaseButton>
                    </router-link>
                </template>

                <template v-else>
                    <router-link
                        :to="{ name: 'login' }"
                        class="px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-700"
                    >
                        Log in
                    </router-link>
                    <router-link :to="{ name: 'signup' }">
                        <BaseButton class="border-none bg-indigo-600 px-5 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md">
                            Get Started
                        </BaseButton>
                    </router-link>
                </template>
            </div>
        </nav>
    </header>
</template>
