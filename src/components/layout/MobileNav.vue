<script setup>
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const isOpen = ref(false);
const store = useStore();
const user = computed(() => store.getters.getUser);

const closeMenu = () => {
    isOpen.value = false;
};
</script>

<template>
    <header class="relative z-30 border-b border-slate-200/70 bg-white/90 px-6 py-4 backdrop-blur">
        <div class="flex items-center justify-between">
            <router-link to="/" class="bungee-shade-regular text-3xl text-indigo-700" @click="closeMenu">
                Kumo
            </router-link>

            <button
                type="button"
                class="flex size-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700"
                :aria-expanded="isOpen"
                aria-label="Toggle navigation"
                @click="isOpen = !isOpen"
            >
                <XMarkIcon v-if="isOpen" class="size-6" />
                <Bars3Icon v-else class="size-6" />
            </button>
        </div>

        <nav v-if="isOpen" class="absolute left-0 top-full w-full border-b border-slate-200 bg-white px-6 py-5 shadow-xl">
            <div class="flex flex-col gap-1">
                <a href="#features" class="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-700" @click="closeMenu">
                    Features
                </a>
                <a href="#how-it-works" class="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-700" @click="closeMenu">
                    How It Works
                </a>
                <router-link
                    :to="{ name: user ? 'dashboard' : 'login' }"
                    class="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-700"
                    @click="closeMenu"
                >
                    {{ user ? 'Dashboard' : 'Log in' }}
                </router-link>
                <router-link
                    v-if="!user"
                    :to="{ name: 'signup' }"
                    class="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
                    @click="closeMenu"
                >
                    Get Started
                </router-link>
            </div>
        </nav>
    </header>
</template>
