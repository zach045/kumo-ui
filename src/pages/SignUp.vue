<template>
    <section class="w-screen min-h-screen flex orbitron-regular">
            <div class="flex flex-wrap h-full w-full min-h-screen px-16 py-12">
                    <plain-nav />
                    <div class="flex w-full justify-start items-start">
                            <base-card title="Login" class="my-auto w-3xl md:w-xl">
                                    <div class="flex justify-between mx-2 mt-4 mb-8 rounded-lg border border-blue-800">
                                            <div class="flex flex-1 justify-center items-center">
                                                    <button class="p-1 w-full rounded-tl-lg rounded-bl-lg cursor-pointer text-blue-800">
                                                        <router-link class="w-full h-full flex justify-center" to="/login">Login</router-link>
                                                    </button>
                                            </div>
                                            <div class="relative flex flex-1 justify-center items-center bg-blue-800 text-white rounded-tr-lg rounded-br-lg">
                                                    <button class="p-1 w-full cursor-pointer">
                                                            <router-link class="w-full h-full flex justify-center" to="/signup">Sign Up</router-link>
                                                    </button>
                                            </div>
                                    </div>
                                    <form @submit.prevent="register" autocomplete="off" class="flex flex-col flex-wrap text-blue-800 rounded-md text-left p-2">
                                            <label for="firstName" class="hidden">First Name</label>
                                            <input id="firstName" name="email" type="text" placeholder="First Name" class="border border-stone-200 rounded-sm mb-4 p-2" v-model="firstName">
                                            <label for="lastName" class="hidden">Last Name</label>
                                            <input id="lastName" name="text" type="text" placeholder="Last Name" class="border border-stone-200 rounded-sm mb-4 p-2" v-model="lastName">
                                            <label for="email" class="hidden">Email</label>
                                            <input id="email" name="email" type="email" placeholder="Email" class="border border-stone-200 rounded-sm mb-4 p-2" v-model="email">
                                            <label for="password" class="hidden">Password</label>
                                            <input id="password" name="password" type="password" placeholder="Password" class="border-stone-200 border rounded-sm p-2 mb-4" v-model="password">
                                            <base-button class="max-w-24">Sign Up</base-button>
                                    </form>
                            </base-card>
                    </div>
            </div>
            <div class="hidden md:block w-full bg-linear-to-b from-sky-100 to-indigo-500">
                    <span class="text-center"></span>
            </div>
    </section>
</template>
<script>
import PlainNav from '../components/layout/PlainNav.vue'
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
            PlainNav
    },
    setup() {

        //local state
        const firstName = ref('');
        const lastName = ref('');
        const name = computed(() => {
                return firstName.value.trim() + ' ' + lastName.value.trim();
        });
        const email = ref('');
        const password = ref('');
        const store = useStore();

        //functions
        function register() {
                store.dispatch('register', { name: name.value, email: email.value, password: password.value });
        }

        return { firstName, lastName, email, password, register };
    }

}
</script>