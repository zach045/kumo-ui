<script setup>
    import { Bars3BottomRightIcon } from '@heroicons/vue/24/solid';
    import { handleError, ref } from 'vue';
    
    //variables 
    const isToggled = ref(false);

    //functions
    function handleIsToggled() {
        isToggled.value = !isToggled.value; 
    }
</script>

<template>
    <header class="w-full relative shadow-lg shadow-blue-200 bg-linear-to-r from-sky-100 to-indigo-500 px-8 py-4">
        <div class="flex items-center justify-between">
            <div class="side-logo text-4xl text-blue-800 hover:text-blue-900">
                <router-link to="/dashboard" class="bungee-shade-regular uppercase">K</router-link>
            </div>
            <button class="cursor-pointer" @click="handleIsToggled">
                <Bars3BottomRightIcon class="size-6 hover:scale-125 transition-all ease-in-out duration-300 text-white" />
            </button>
        </div>
        <nav v-if="isToggled" class="bg-white overflow-none z-30 absolute top-18 left-0 w-full px-8 py-4">
            <span>hey</span>
        </nav>
    </header>
</template>