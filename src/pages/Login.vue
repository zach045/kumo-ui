<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
    ArrowRightIcon,
    ChartBarSquareIcon,
    CheckCircleIcon,
    LightBulbIcon,
    LockClosedIcon,
} from '@heroicons/vue/24/outline';
import PlainNav from '../components/layout/PlainNav.vue';
import GoogleSignIn from '../components/GoogleSignIn.vue';
import { isValidEmail } from '../utils/validation';

const email = ref('');
const password = ref('');
const loginError = ref('');
const isSubmitting = ref(false);

const store = useStore();
const router = useRouter();
const isAuthenticated = computed(() => store.getters.isAuthenticated);

async function login() {
    loginError.value = '';

    if (!isValidEmail(email.value)) {
        loginError.value = 'Enter a valid email address with a domain suffix, such as name@example.com.';
        return;
    }

    isSubmitting.value = true;

    try {
        const result = await store.dispatch('login', {
            email: email.value,
            password: password.value,
        });

        if (!result?.success) {
            loginError.value = result?.error || 'We couldn’t log you in. Please try again.';
            return;
        }

        const token = localStorage.getItem('token');

        if (isAuthenticated.value && token) {
            await router.push('/dashboard');
            return;
        }

        loginError.value = store.getters.getAuthError || 'We couldn’t complete your login. Please try again.';
    } catch (error) {
        loginError.value = 'Something unexpected happened. Please try again.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <main class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100">
        <div class="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[0.92fr_1.08fr]">
            <section class="relative flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-14 xl:px-20">
                <PlainNav />

                <div class="flex flex-1 items-center justify-center py-12">
                    <div class="w-full max-w-md">
                        <div class="mb-9">
                            <p class="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">Welcome back</p>
                            <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-950">Log in to Kumo</h1>
                            <p class="mt-3 leading-7 text-slate-600">
                                Continue analyzing your website and turning SEO insights into action.
                            </p>
                        </div>

                        <div class="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-indigo-200/50 backdrop-blur sm:p-8">
                            <div class="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
                                <router-link
                                    :to="{ name: 'login' }"
                                    class="rounded-lg bg-white px-4 py-2.5 text-center text-indigo-700 shadow-sm"
                                >
                                    Log in
                                </router-link>
                                <router-link
                                    :to="{ name: 'signup' }"
                                    class="rounded-lg px-4 py-2.5 text-center text-slate-500 transition hover:text-indigo-700"
                                >
                                    Sign up
                                </router-link>
                            </div>

                            <form class="mt-7 space-y-5" autocomplete="off" @submit.prevent="login">
                                <div>
                                    <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                                    <input
                                        id="email"
                                        v-model="email"
                                        name="email"
                                        type="email"
                                        autocomplete="email"
                                        required
                                        placeholder="you@example.com"
                                        class="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <div class="mb-2 flex items-center justify-between">
                                        <label for="password" class="text-sm font-semibold text-slate-700">Password</label>
                                        <span class="text-xs font-medium text-slate-400">Secure login</span>
                                    </div>
                                    <input
                                        id="password"
                                        v-model="password"
                                        name="password"
                                        type="password"
                                        autocomplete="current-password"
                                        required
                                        placeholder="Enter your password"
                                        class="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                <div
                                    v-if="loginError"
                                    role="alert"
                                    class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    {{ loginError }}
                                </div>

                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {{ isSubmitting ? 'Logging in…' : 'Log in' }}
                                    <ArrowRightIcon v-if="!isSubmitting" class="size-4" />
                                </button>
                            </form>

                            <div class="my-7 flex items-center gap-4">
                                <div class="h-px flex-1 bg-slate-200"></div>
                                <span class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">or continue with</span>
                                <div class="h-px flex-1 bg-slate-200"></div>
                            </div>

                            <GoogleSignIn />

                            <p class="mt-7 text-center text-sm text-slate-500">
                                New to Kumo?
                                <router-link :to="{ name: 'signup' }" class="font-semibold text-indigo-700 hover:text-indigo-800">
                                    Create your account
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="relative hidden overflow-hidden bg-slate-950 px-12 py-14 text-white lg:flex lg:items-center xl:px-20">
                <div class="pointer-events-none absolute -left-28 top-24 size-96 rounded-full bg-sky-400/20 blur-3xl"></div>
                <div class="pointer-events-none absolute -bottom-32 right-0 size-[28rem] rounded-full bg-indigo-500/25 blur-3xl"></div>

                <div class="relative mx-auto w-full max-w-xl">
                    <div class="mb-10">
                        <p class="text-sm font-bold uppercase tracking-[0.18em] text-sky-400">Clarity for every decision</p>
                        <h2 class="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                            Pick up where your SEO strategy left off.
                        </h2>
                        <p class="mt-5 max-w-lg text-lg leading-8 text-slate-300">
                            Your latest website scores, opportunities, and recommendations are waiting in one focused workspace.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
                        <div class="flex items-center justify-between border-b border-white/10 pb-5">
                            <div>
                                <p class="text-sm font-semibold">Your Kumo workspace</p>
                                <p class="mt-1 text-xs text-slate-400">Everything stays organized</p>
                            </div>
                            <div class="flex size-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                                <LockClosedIcon class="size-5" />
                            </div>
                        </div>

                        <div class="mt-6 grid gap-4 sm:grid-cols-2">
                            <div class="rounded-xl bg-white/[0.06] p-4">
                                <ChartBarSquareIcon class="size-6 text-sky-400" />
                                <p class="mt-4 font-semibold">Track progress</p>
                                <p class="mt-1 text-sm leading-6 text-slate-400">Return to previous analyses and see how your site is evolving.</p>
                            </div>
                            <div class="rounded-xl bg-white/[0.06] p-4">
                                <LightBulbIcon class="size-6 text-indigo-300" />
                                <p class="mt-4 font-semibold">Act with focus</p>
                                <p class="mt-1 text-sm leading-6 text-slate-400">Keep prioritized recommendations close to the work that matters.</p>
                            </div>
                        </div>

                        <div class="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3">
                            <CheckCircleIcon class="size-5 shrink-0 text-emerald-400" />
                            <p class="text-sm text-emerald-100">Secure access to your website analysis history.</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</template>
