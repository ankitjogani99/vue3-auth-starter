<template>
  <main style="display:grid; place-items:center; min-height: calc(100vh - 56px); padding: 1rem;">
    <section class="card" style="width:100%; max-width: 420px;">
      <h1>Login</h1>
      <form @submit.prevent="submit">
        <label>Email
          <input v-model.trim="email" type="email" placeholder="you@example.com" />
          <small class="error" v-if="errors.email">{{ errors.email }}</small>
        </label>
        <label>Password
          <input v-model="password" type="password" placeholder="••••••••" />
          <small class="error" v-if="errors.password">{{ errors.password }}</small>
        </label>
        <button class="btn" :disabled="loading">{{ loading ? 'Signing in...' : 'Login' }}</button>
        <p class="error" v-if="error">⚠️ {{ error }}</p>
      </form>
      <p style="margin-top:.75rem; opacity:.8;">
        Don’t have an account? <router-link to="/register">Register</router-link>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/composables/useToast';
import { validateLogin } from '@/validators';

const store = useStore();
const route = useRoute();
const router = useRouter();

const email = ref('ankit.ezpapel@gmail.com');
const password = ref('Admin@123');

const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const errors = ref({});

async function submit() {
  errors.value = validateLogin({ email: email.value, password: password.value });
  if (Object.keys(errors.value).length) {
    toast.error('Please fix the errors in the form');
    return;
  }
  try {
    await store.dispatch('login', { email: email.value, password: password.value });
    const redirect = route.query.redirect || '/dashboard';
    toast.success('Welcome back!');
    router.replace(redirect);
  } catch (e) {
    // error toast handled in store
  }
}
</script>