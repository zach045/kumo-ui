<script setup>
    const props = defineProps({
        variant: {
            type: String, 
            default: 'blue'
        }
    });

    const variants = {
        lightBlue: 'border-sky-300',
        blue: 'border-blue-400',
        darkBlue: 'border-blue-700',
        lightGreen: 'border-green-200',
        green: 'border-green-500',
        darkGreen: 'border-green-800',
    }
</script>

<template>
    <div class="w-full">
        <div class="py-4 flex justify-between items-center">
            <slot name="label">
                <span class="text-blue-800"></span>
            </slot>
            <slot name="actions">
                <span></span>
            </slot>
        </div>
        <div :class="variants[variant] || variants.default" class="bg-gray-200 border-l-4 px-4 py-3 rounded-lg">
            <slot name="input"></slot>
        </div>
    </div>
</template>