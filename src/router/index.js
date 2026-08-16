import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import Dashboard from '../pages/Dashboard.vue';
import Login from '../pages/Login.vue';
import SignUp from '../pages/SignUp.vue';
import ModulePlaceholder from '../pages/ModulePlaceholder.vue';
import Snapshot from '../components/seo/SnapshotList.vue';
import SnapshotItem from '../components/seo/SnapshotItem.vue';

const protectedModule = (path, name, title, description) => ({
  path,
  name,
  component: ModulePlaceholder,
  props: { title, description },
  meta: { requiresAuth: true },
});

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/signup', component: SignUp, name: 'signup' },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    meta: { requiresAuth: true },
  },
  {
    path: '/snapshots',
    alias: '/seo-snapshot',
    component: Snapshot,
    name: 'seo-snapshot',
    meta: { requiresAuth: true },
  },
  {
    path: '/snapshots/:id',
    alias: '/seo-snapshot/:id',
    name: 'snapshot-item',
    component: SnapshotItem,
    meta: { requiresAuth: true },
  },
  protectedModule('/keywords', 'keywords', 'Keywords', 'Discover, organize, and prioritize the search terms that can move your content forward.'),
  protectedModule('/reports', 'reports', 'Reports', 'Turn snapshot data into clear, shareable performance reports and recommendations.'),
  protectedModule('/history', 'history', 'History', 'Review previous analyses, compare changes, and understand how your site is progressing.'),
  protectedModule('/settings', 'settings', 'Settings', 'Manage your profile, website preferences, integrations, and account security.'),
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
