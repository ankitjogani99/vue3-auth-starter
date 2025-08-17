<template>
  <main style="display:grid; place-items:center; min-height: calc(100vh - 56px); padding: 1rem;">
    <section class="card" style="width:100%; max-width: 780px;">
      <h1>Register (Carrier One Step)</h1>
      <form @submit.prevent="submit">
        <div class="grid-2">
          <label>USDOT
            <input v-model.trim="form.usdot_number" />
            <small class="error" v-if="errors.usdot_number">{{ errors.usdot_number }}</small>
          </label>
          <label>Timezone
            <input v-model.trim="form.timezone" placeholder="Asia/Kolkata" />
            <small class="error" v-if="errors.timezone">{{ errors.timezone }}</small>
          </label>
        </div>
        <label>Business Name
          <input v-model.trim="form.business_name" />
          <small class="error" v-if="errors.business_name">{{ errors.business_name }}</small>
        </label>
        <div class="grid-2">
          <label>Company Type
            <input v-model.trim="form.companyType" placeholder="carrier" />
            <small class="error" v-if="errors.companyType">{{ errors.companyType }}</small>
          </label>
          <label>Phone
            <input v-model.trim="form.phone_number" />
            <small class="error" v-if="errors.phone_number">{{ errors.phone_number }}</small>
          </label>
        </div>
        <label>Address
          <input v-model.trim="form.address" />
          <small class="error" v-if="errors.address">{{ errors.address }}</small>
        </label>
        <div class="grid-2">
          <label>First Name
            <input v-model.trim="form.first_name" />
            <small class="error" v-if="errors.first_name">{{ errors.first_name }}</small>
          </label>
          <label>Last Name
            <input v-model.trim="form.last_name" />
            <small class="error" v-if="errors.last_name">{{ errors.last_name }}</small>
          </label>
        </div>
        <label>Email
          <input type="email" v-model.trim="form.email" />
          <small class="error" v-if="errors.email">{{ errors.email }}</small>
        </label>
        <label>Product (comma-separated)
          <input v-model.trim="productsInput" placeholder="marketing, crm" />
          <small class="error" v-if="errors.product">{{ errors.product }}</small>
        </label>

        <button class="btn" :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
        <p class="error" v-if="error">⚠️ {{ error }}</p>
      </form>
      <p style="margin-top:.75rem; opacity:.8;">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { toast } from '@/composables/useToast';
import { validateRegister } from '@/validators';

const store = useStore();
const router = useRouter();

const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);

const form = reactive({
  usdot_number: '2222',
  timezone: 'Asia',
  business_name: 'John Doe Pvt. Ltd.',
  companyType: 'carrier',
  address: '4334 N Hazel St',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '423454543',
  email: 'johnd221d12dss21e3@gmail.com',
  product: ['marketing'],
});
const productsInput = ref(form.product.join(', '));
const errors = ref({});

async function submit() {
  form.product = productsInput.value ? productsInput.value.split(',').map(s => s.trim()).filter(Boolean) : [];
  errors.value = validateRegister({ ...form });

  if (Object.keys(errors.value).length) {
    toast.error('Please fix the errors in the form');
    return;
  }

  try {
    const res = await store.dispatch('register', { ...form });
    toast.success(res?.message || 'Registered successfully');
    router.replace('/dashboard');
  } catch (e) {
    // error toast handled in store
  }
}
</script>