<template>
    <div class="w-full">
        <div class="flex min-h-11 w-full items-center justify-center overflow-hidden rounded-lg">
            <div id="google-signin-button"></div>
        </div>

        <div
            v-if="googleError"
            role="alert"
            aria-live="polite"
            class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            {{ googleError }}
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import router from '../router';

const store = useStore();
const googleError = ref('');

const handleCredentialResponse = async (response) => {
    googleError.value = '';

    if (!response.credential) {
        googleError.value = 'Google Sign-In did not return a credential. Please try again.';
        return;
    }

    try {
        const result = await store.dispatch('googleLogin', response.credential);

        if (!result?.success) {
            googleError.value = result?.error
                || 'We couldn’t complete Google Sign-In. Please try again.';
            return;
        }

        const token = localStorage.getItem('token');
        const authenticated = store.getters.isAuthenticated;

        if (authenticated && token) {
            await router.push('/dashboard');
            return;
        }

        googleError.value = store.getters.getAuthError
            || 'We couldn’t complete Google Sign-In. Please try again.';
    } catch (error) {
        googleError.value = 'Something unexpected happened with Google Sign-In. Please try again.';
    }
};

function loadGoogleScript() {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

onMounted(async () => {
    try {
        await loadGoogleScript();

        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
                theme: 'outline',
                size: 'large',
                shape: 'rectangular',
                text: 'signin_with',
                width: 360,
            }
        );

        window.google.accounts.id.prompt();
    } catch (error) {
        googleError.value = 'Google Sign-In is temporarily unavailable. Please use email and password or try again later.';
        console.error('Failed to load Google Identity script', error);
    }
});
</script>
