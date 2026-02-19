<template>
    <div class="after:content[''] after:absolute after:bg-zinc-900 after:opacity-50 after:h-screen after:w-full after:top-0 after:left-0 after:overflow-hidden! after:z-30 z-40">
        <slot class="z-100"></slot>
    </div>
</template>

<style scoped>
body, html {
    overflow: hidden;
}
</style>