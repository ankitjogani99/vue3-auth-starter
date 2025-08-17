<template>
  <nav class="nav">
    <div class="brand" @click="$router.push('/dashboard')">Truckpedia Admin</div>
    <div class="spacer"></div>
    <template v-if="isAuthed">
      <button class="btn" @click="go('/dashboard')">Dashboard</button>
       <button class="btn" @click="go('/drivers')">Drivers</button>
      <button class="btn outline" @click="doLogout">Logout</button>
    </template>
    <template v-else>
      <button class="btn" @click="go('/login')">Login</button>
      <button class="btn outline" @click="go('/register')">Register</button>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const isAuthed = computed(() => store.getters.isAuthenticated);
function go(path) { router.push(path); }
function doLogout() {
  store.dispatch('logout');
  router.push('/login');
}
</script>

<style scoped>
.nav { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem; background:#14161a; border-bottom:1px solid #ffffff1a; position:sticky; top:0; z-index: 10; }
.brand { font-weight:700; cursor:pointer; }
.spacer { flex:1; }
</style>