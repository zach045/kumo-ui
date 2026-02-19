import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import Dashboard from '../pages/Dashboard.vue';
import Login from '../pages/Login.vue';
import SignUp from '../pages/SignUp.vue';
import Snapshot from '../components/seo/SnapshotList.vue';
import SnapshotItem from '../components/seo/SnapshotItem.vue';

const routes = [ 
   { path: '/', component: HomePage, name: 'home' },
   { path: '/login', component: Login, name: 'login' },
   { path: '/signup', component: SignUp, name:'signup' },
   { 
      path: '/dashboard', 
      component: Dashboard, 
      name: 'dashboard', 
      meta: {requiresAuth: true },
   },
   { 
      path: '/seo-snapshot', 
      component: Snapshot, 
      name:'seo-snapshot', 
      meta: { requiresAuth: true }
   },
   {
      path: '/seo-snapshot/:id',
      name: 'snapshot-item',
      component: SnapshotItem,
      meta: { requiresAuth: true }
   }
 ];

 const router = createRouter({
    history: createWebHistory(),
    routes
 });

 export default router;