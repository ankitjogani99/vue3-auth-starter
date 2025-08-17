import { reactive } from 'vue';

// Simple toast store (module-scoped)
const state = reactive({
  items: [], // { id, type, title, message }
});

let idSeq = 1;
function push(type, title, message, timeout = 2800) {
  const id = idSeq++;
  state.items.push({ id, type, title, message });
  if (timeout) {
    setTimeout(() => remove(id), timeout);
  }
}
function remove(id) {
  const idx = state.items.findIndex(t => t.id === id);
  if (idx >= 0) state.items.splice(idx, 1);
}

export function useToast() {
  return {
    items: state.items,
    remove,
  };
}

export const toast = {
  success(message, title = 'Success') { push('success', title, message); },
  error(message, title = 'Error') { push('error', title, message); },
  warn(message, title = 'Notice') { push('warn', title, message); },
  info(message, title = 'Info') { push('info', title, message); },
};