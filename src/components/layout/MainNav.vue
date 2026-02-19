<template>
    <header class="w-screen absolute top-0 left-0 flex justify-center items-center">
        <nav class="flex items-center justify-between w-7xl h-16 px-8">
            <div class="logo text-5xl text-blue-800 hover:text-blue-900 flex items-center">
                <router-link to="/" class="bungee-shade-regular">Kumo</router-link>
            </div>
            <div class="orbitron-regular flex justify-end items-center">
                <ul class="flex justify-center items-center">
                    <li v-for="item in items" :key="item.name" class="mx-2 text-blue-800 hover:text-blue-500 font-medium p-2 text-sm">
                        <a :href="item.link" class="after:content-[' '] after:w-full after-bg-blue-800 after:h-2">{{ item.name }}</a>
                    </li>
                </ul>
                <router-link v-for="route in routes" :to="{ name: user ? 'dashboard' : route.dest }" :key="route.name" class="mx-2 text-blue-800 hover:text-blue-500 font-medium text-sm flex" exact>
                    <BaseButton class="bg-linear-to-r from-sky-300 to-indigo-300 hover:text-white hover:scale-105 transition-all duration-300 border-none">
                        <span v-if="user">
                           <UserCircleIcon class="size-4 mr-1" />
                        </span>
                        {{ user ? user.name : route.name }}
                    </BaseButton>
                </router-link>
            </div>
        </nav>
    </header>
</template>



<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ArrowRightEndOnRectangleIcon, UserCircleIcon } from '@heroicons/vue/24/solid';
import { CloudIcon, UserIcon } from '@heroicons/vue/24/outline';
import BaseButton from '../UI/BaseButton.vue';

const items = ref([
    {
        name: 'Features',
        link: '#features'
    },
    {
        name: 'Pricing',
        link: '#pricing'
    },
    {
        name: 'Contact',
        link: '#contact'
    },
]);

const routes = ref([
    {
        name: 'Login',
        dest: 'login'
    }
]);

const store = useStore();
const user = computed(() => store.getters.getUser);
</script>