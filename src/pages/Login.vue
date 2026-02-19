<template>
        <section class="w-screen min-h-screen flex orbitron-regular">
                <div class="flex flex-wrap w-full h-full min-h-screen px-16 py-12">
                        <plain-nav />
                        <div class="flex w-full justify-start items-start">
                                <base-card title="Login" class="my-auto w-3xl md:w-xl">
                                        <div class="flex justify-between mx-2 mt-4 mb-8 rounded-lg border border-blue-800">
                                                <div class="flex flex-1 justify-center items-center rounded-tl-lg rounded-bl-lg bg-blue-800">
                                                        <button class="p-1 w-full rounded-tl-lg rounded-bl-lg cursor-pointer text-white">
                                                                <router-link to="/login" class="w-full h-full flex justify-center">Login</router-link>
                                                        </button>
                                                </div>
                                                <div class="flex flex-1 justify-center items-center">
                                                        <button class="p-1 w-full cursor-pointer">
                                                                <router-link to="/signup" class="w-full h-full flex justify-center text-blue-800">Sign Up</router-link>
                                                        </button>
                                                </div>
                                        </div>
                                        <form @submit.prevent="login" autocomplete="off" class="flex flex-col flex-wrap text-blue-800 rounded-md text-left p-2">
                                                <label for="email" class="hidden">Email</label>
                                                <input id="email" name="email" type="email" placeholder="Email" class="border border-stone-200 rounded-sm mb-4 p-2" v-model="email">
                                                <label for="password" class="hidden">Password</label>
                                                <input id="password" name="password" type="password" placeholder="Password" class="border-stone-200 border rounded-sm p-2 mb-4" v-model="password">
                                                <div class="flex wrap flex-col">
                                                        <base-button class="max-w-24">Login</base-button>
                                                        <hr class="text-sky-300 my-8">
                                                        <googleSignIn />
                                                </div>
                                        </form>
                                        <p v-if="!!loginError" class="text-red-700">User does not exist. Please try again.</p>
                                </base-card>
                        </div>
                </div>
                <div class="hidden md:block w-full bg-linear-to-b from-sky-100 to-indigo-500">
                        <span class="text-center"></span>
                </div>
        </section>
</template>
<script>
import PlainNav from '../components/layout/PlainNav.vue';
//import ProtectedComponent from './components/ProtectedComponent.vue';
import GoogleSignIn from '../components/GoogleSignIn.vue';
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
        components: {
                PlainNav,
                GoogleSignIn
        },
        setup() {
                //local state
                const email = ref('');
                const password = ref('')
                const store = useStore();
                const router = useRouter();
                const loginError = ref(false);


                //functions
                function handleError() {
                        loginError.value = true;
                        router.replace('/login');
                        console.log(loginError);
                }

                function handleAuth() {
                        loginError.value = false;
                        router.push('/dashboard');
                }
                function login() {
                        const authenticated = computed(() => store.getters.isAuthenticated);
                        store.dispatch('login', { email: email.value, password: password.value }).then(() => {
                                const token = localStorage.getItem('token');
                                authenticated.value && token ? handleAuth() : handleError();
                        });
                };



                return { login, email, password, loginError };


        }

}
</script>