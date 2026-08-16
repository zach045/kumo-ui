import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseLayout from './components/layout/BaseLayout.vue';

(async () => {
  await store.dispatch('fetchUser');

  router.beforeEach((to) => {
    const isAuthenticated = store.getters.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: 'login' };
    }

    if ((to.name === 'login' || to.name === 'signup') && isAuthenticated) {
      return { name: 'dashboard' };
    }

    return true;
  });

  const app = createApp(App);
  app.component('base-card', BaseCard);
  app.component('base-button', BaseButton);
  app.component('base-layout', BaseLayout);
  app.use(store);
  app.use(router);
  app.mount('#app');
})();
