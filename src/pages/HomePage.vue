<!-- <template>
    <div>
        <main-nav />
        <hero />
    </div>
</template>

<script>
import MainNav from '../components/layout/MainNav.vue';
import Hero from '../components/home/Hero.vue';
import BaseButton from '../components/UI/BaseButton.vue';

export default {
    components: {
        MainNav,
        Hero
    }
}
</script>
   -->
<script setup>
import MainNav from '../components/layout/MainNav.vue';
import MobileNav from '../components/layout/MobileNav.vue';
import Hero from '../components/home/Hero.vue';
import BaseButton from '../components/UI/BaseButton.vue';

</script>
  
<template>
    <section>
        <div>
            <main-nav class="hidden md:flex" />
            <mobile-nav class="md:hidden" />
        </div>
        <div>
            <hero />
        </div>
    </section>
</template>
