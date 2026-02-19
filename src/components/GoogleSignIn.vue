<template>
    <div>
        <div
          id="google-signin-button">
        </div> 

    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, computed } from 'vue';
import router from '../router';

const store = useStore();

const handleCredentialResponse = async (response) => {
    if (response.credential) {
      await store.dispatch('googleLogin', response.credential);
      const token = localStorage.getItem('token');
      const authenticated = store.getters.isAuthenticated;
      authenticated && token ? router.push('/dashboard') : router.replace('/login');;
        
    } else {
        console.error("No credential received from Google Sign-In.");
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
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );

    window.google.accounts.id.prompt();
  } catch (err) {
    console.error("Failed to load Google Identity script", err);
  }
});


</script>