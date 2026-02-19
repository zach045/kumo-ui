<script setup>
    import { computed } from 'vue';
    import BaseCard from './BaseCard.vue';

    const props = defineProps({
        variant: {
            type: String, 
            default: 'blue'
        },
        headerBgVariant: {
            type: String,
            default: 'white'
        },
        bodyBgVariant: {
            type: String,
            default: 'white'
        },
        showFooter: {
            type: Boolean,
            default: false
        }
    });

    const bgVariants = {
        lightBlue: 'bg-sky-300',
        blue: 'bg-blue-400',
        darkBlue: 'bg-blue-700',
        lightGreen: 'bg-green-200',
        green: 'bg-green-500',
        darkGreen: 'bg-green-800',
        white: 'bg-white',
        lightGray: 'bg-gray-100',
        indigoGradient: 'bg-linear-to-l from-indigo-400 to-indigo-800'
    }
</script>

<template>
    <BaseCard>
        <div :class="bgVariants[headerBgVariant] || bgVariants.default" class="px-8 py-6 rounded-tl-md rounded-tr-md">
            <slot name="header"></slot>
        </div>
        <div :class="bgVariants[bodyBgVariant] || bgVariants.default" class="px-8 py-2 rounded-bl-md rounded-br-md">
            <slot name="body"></slot>
        </div>
        <div :class="bgVariants[bodyBgVariant] || bgVariants.default" class="px-8 py-2 rounded-bl-md rounded-br-md">
            <slot name="footer"></slot>
        </div>
    </BaseCard>
</template>