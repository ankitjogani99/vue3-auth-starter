<template>
  <div class="toasts">
    <div v-for="t in items" :key="t.id" class="toast" :class="t.type">
      <div class="title">{{ t.title }}</div>
      <div class="msg">{{ t.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
const { items } = useToast();
</script>