<template>
  <div class="app">
    <Navbar />
    <router-view class="container" />
    <Toasts />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Toasts from '@/components/Toasts.vue';
</script>