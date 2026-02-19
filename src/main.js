import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js';
import store from './store/index.js';
import BaseCard from './components/UI/BaseCard.vue';
import BaseButton from './components/UI/BaseButton.vue';
import BaseLayout from './components/layout/BaseLayout.vue';


const token = localStorage.getItem('token');

async function fetchUser() {
  await store.dispatch('fetchUser');
}

(async () => {
  if (token) {
    store.commit('SET_TOKEN', token);
    await fetchUser(); // ✅ await here inside async context
  }

  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!store.getters.getUser;

    if (to.meta.requiresAuth && !isAuthenticated) {
      console.warn('Not authorized. Redirecting to login.');
      next({ name: 'login' });
    } else {
      next();
    }
  });

  // console.log(token);

  const app = createApp(App);
  app.component('base-card', BaseCard);
  app.component('base-button', BaseButton);
  app.component('base-layout', BaseLayout);
  app.use(store);
  app.use(router);
  app.mount('#app');
})();
