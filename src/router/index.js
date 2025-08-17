import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const Login = () => import('@/views/Login.vue');
const Register = () => import('@/views/Register.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Drivers = () => import('@/views/Drivers.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: Register, meta: { guestOnly: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
     // NEW
    { path: '/drivers', name: 'drivers', component: Drivers, meta: { requiresAuth: true } },

    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
});

router.beforeEach((to) => {
  const authed = store.getters.isAuthenticated;
  if (to.meta.requiresAuth && !authed) return { name: 'login', query: { redirect: to.fullPath } };
  if (to.meta.guestOnly && authed) return { name: 'dashboard' };
  return true;
});

export default router;