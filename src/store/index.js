import { createStore } from 'vuex';
import { api } from '@/api';
import { toast } from '@/composables/useToast';

export default createStore({
  state() {
    return {
      token: localStorage.getItem('access_token') || '',
      user: null,
      loading: false,
      error: '',
    };
  },
  getters: {
    isAuthenticated: (s) => !!s.token,
    currentUser: (s) => s.user,
  },
  mutations: {
    setLoading(s, v) { s.loading = v; },
    setError(s, v) { s.error = v || ''; },
    setToken(s, token) {
      s.token = token || '';
      if (token) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
    },
    setUser(s, u) { s.user = u || null; },
  },
  actions: {
    async register({ commit }, payload) {
      commit('setLoading', true);
      commit('setError', '');
      try {
        const res = await api.registerCarrierOneStep(payload);
        const token = res?.payload?.access_token || res?.access_token || res?.token || '';
        if (!token) throw new Error('No access token in register response');
        commit('setToken', token);
        toast.success('Registration successful');
        return res;
      } catch (e) {
        commit('setError', e.message);
        toast.error(e.message || 'Registration failed');
        throw e;
      } finally {
        commit('setLoading', false);
      }
    },
    async login({ commit }, { email, password }) {
      commit('setLoading', true);
      commit('setError', '');
      try {
        const res = await api.login({ email, password });
        const token = res?.access_token || res?.token || res?.payload?.access_token || '';
        if (!token) throw new Error('No access token in login response');
        commit('setToken', token);
        toast.success('Logged in successfully');
        return res;
      } catch (e) {
        commit('setError', e.message);
        toast.error(e.message || 'Login failed');
        throw e;
      } finally {
        commit('setLoading', false);
      }
    },
    logout({ commit }) {
      commit('setToken', '');
      commit('setUser', null);
      toast.warn('Logged out');
    },
  },
});