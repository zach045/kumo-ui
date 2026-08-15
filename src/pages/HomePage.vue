<script setup>
import MainNav from '../components/layout/MainNav.vue';
import MobileNav from '../components/layout/MobileNav.vue';
import Hero from '../components/home/Hero.vue';
import FeaturesSection from '../components/home/FeaturesSection.vue';
import HowItWorks from '../components/home/HowItWorks.vue';
import HomeCta from '../components/home/HomeCta.vue';
import AppFooter from '../components/layout/AppFooter.vue';
</script>

<template>
    <main class="min-h-screen bg-white">
        <MainNav class="hidden md:flex" />
        <MobileNav class="md:hidden" />
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <HomeCta />
        <AppFooter />
    </main>
</template>
