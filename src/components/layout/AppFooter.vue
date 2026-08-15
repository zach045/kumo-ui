<script setup>
const year = new Date().getFullYear();

const productLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
];
</script>

<template>
    <footer class="border-t border-slate-200 bg-slate-50 px-6">
        <div class="mx-auto grid max-w-7xl gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div class="max-w-sm">
                <router-link to="/" class="bungee-shade-regular text-3xl text-indigo-700">Kumo</router-link>
                <p class="mt-4 text-sm leading-6 text-slate-600">
                    Clear website analysis and prioritized SEO guidance for teams ready to improve their organic visibility.
                </p>
            </div>

            <div>
                <p class="text-sm font-bold text-slate-900">Product</p>
                <ul class="mt-4 space-y-3">
                    <li v-for="link in productLinks" :key="link.label">
                        <a :href="link.href" class="text-sm text-slate-600 transition-colors hover:text-indigo-700">
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <p class="text-sm font-bold text-slate-900">Account</p>
                <ul class="mt-4 space-y-3">
                    <li>
                        <router-link :to="{ name: 'login' }" class="text-sm text-slate-600 transition-colors hover:text-indigo-700">Log in</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'signup' }" class="text-sm text-slate-600 transition-colors hover:text-indigo-700">Get started</router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mx-auto flex max-w-7xl flex-col gap-2 border-t border-slate-200 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {{ year }} Kumo. All rights reserved.</p>
            <p>SEO insights made easier to understand.</p>
        </div>
    </footer>
</template>
