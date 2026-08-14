<script setup>
import MainNav from '../components/layout/MainNav.vue';
import MobileNav from '../components/layout/MobileNav.vue';
import Hero from '../components/home/Hero.vue';
</script>

<template>
    <main class="min-h-screen bg-white">
        <MainNav class="hidden md:flex" />
        <MobileNav class="md:hidden" />
        <Hero />
    </main>
</template>
