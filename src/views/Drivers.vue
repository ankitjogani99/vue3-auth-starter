<template>
  <main style="padding: 1rem">
    <section class="card">
      <header
        style="
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: space-between;
        "
      >
        <h1 style="margin: 0">Drivers</h1>
        <div style="display: flex; gap: 0.5rem; align-items: center">
          <button class="btn" @click="load()">Refresh</button>
        </div>
      </header>

      <!-- Filters -->
      <form
        @submit.prevent="applyFilters"
        style="margin-top: 0.75rem; display: grid; gap: 0.6rem"
      >
        <div class="grid-2">
          <label
            >Status
            <select v-model="filters.status">
              <option :value="undefined">Any</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <label
            >To Download
            <select v-model="filters.toDownload">
              <option :value="undefined">Any</option>
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </label>
        </div>
        <div class="grid-2">
          <label
            >Tag ID
            <input
              v-model.number="filters.tagId"
              type="number"
              min="1"
              placeholder="e.g. 10"
            />
          </label>
          <label
            >Label ID
            <input
              v-model.number="filters.labelId"
              type="number"
              min="1"
              placeholder="e.g. 2"
            />
          </label>
        </div>
        <div style="display: flex; gap: 0.5rem">
          <button class="btn" :disabled="loading">
            {{ loading ? 'Applying...' : 'Apply Filters' }}
          </button>
          <button
            type="button"
            class="btn outline"
            @click="clearFilters"
            :disabled="loading"
          >
            Clear
          </button>
        </div>
      </form>

      <!-- Table -->
      <div style="overflow: auto; margin-top: 1rem">
        <table style="width: 100%; border-collapse: collapse">
          <thead>
            <tr>
              <th
                v-for="h in headers"
                :key="h.key"
                style="
                  text-align: left;
                  padding: 0.5rem;
                  border-bottom: 1px solid #ffffff22;
                "
              >
                {{ h.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="headers.length" style="padding: 0.8rem">
                Loading...
              </td>
            </tr>
            <tr v-else-if="rows.length === 0">
              <td :colspan="headers.length" style="padding: 0.8rem">
                No drivers found.
              </td>
            </tr>
            <tr v-else v-for="r in rows" :key="r.id">
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.id }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                <div>
                  <strong>{{
                    r.name || r.firstName + ' ' + r.lastName
                  }}</strong>
                </div>
                <small style="opacity: 0.8"
                  >{{ r.firstName }} {{ r.lastName }}</small
                >
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.truckNumber ?? '-' }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.trailerNumber ?? '-' }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.phone ?? '-' }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.email ?? '-' }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.driverType }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                {{ r.companyEmployeeId ?? '-' }}
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                <span v-if="(r.tags?.length || 0) === 0" style="opacity: 0.6"
                  >-</span
                >
                <span
                  v-else
                  v-for="t in r.tags"
                  :key="t.tagId"
                  style="
                    display: inline-block;
                    padding: 0.2rem 0.4rem;
                    margin: 0.1rem;
                    border: 1px solid #ffffff22;
                    border-radius: 9999px;
                  "
                >
                  {{ t.tagBusinessName ?? '#' + t.tagId }}
                </span>
              </td>
              <td style="padding: 0.5rem; border-bottom: 1px solid #ffffff14">
                <span v-if="(r.labels?.length || 0) === 0" style="opacity: 0.6"
                  >-</span
                >
                <span
                  v-else
                  v-for="lb in r.labels"
                  :key="lb.id"
                  style="
                    display: inline-block;
                    padding: 0.2rem 0.4rem;
                    margin: 0.1rem;
                    border: 1px solid #ffffff22;
                    border-radius: 9999px;
                  "
                >
                  {{ lb.name ?? '#' + lb.id }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        style="
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: flex-end;
          margin-top: 0.75rem;
        "
      >
        <span style="opacity: 0.8"
          >Page {{ meta.current_page || 1 }} of {{ meta.last_page || 1 }}</span
        >
        <button
          class="btn outline"
          :disabled="loading || !hasPrev"
          @click="go(meta.current_page - 1)"
        >
          Prev
        </button>
        <button
          class="btn outline"
          :disabled="loading || !hasNext"
          @click="go(meta.current_page + 1)"
        >
          Next
        </button>
      </div>

      <p class="error" v-if="error" style="margin-top: 0.5rem">
        ⚠️ {{ error }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { api } from '@/api';
import { toast } from '@/composables/useToast';

const loading = ref(false);
const error = ref('');
const rows = ref([]);
const meta = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0,
});

const headers = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'truckNumber', label: 'Truck #' },
  { key: 'trailerNumber', label: 'Trailer #' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'driverType', label: 'Type' },
  { key: 'companyEmployeeId', label: 'Emp ID' },
  { key: 'tags', label: 'Tags' },
  { key: 'labels', label: 'Labels' },
];

const pageSize = ref(25);
const filters = reactive({
  toDownload: undefined, // true/false/undefined
  status: undefined, // 'active'/'inactive'/undefined
  tagId: undefined,
  labelId: undefined,
});
const page = ref(1);

const hasPrev = computed(() => (meta.current_page || 1) > 1);
const hasNext = computed(
  () => (meta.current_page || 1) < (meta.last_page || 1)
);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    // build filter object with only defined keys
    const filter = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') filter[k] = v;
    }

    const res = await api.listDrivers({
      page: page.value,
      pageSize: pageSize.value,
      filter,
      sortBy: {}, // customize if needed
    });

    const payload = res?.payload || {};
    rows.value = payload.data || [];
    Object.assign(meta, payload.meta || {});
    toast.info(`Loaded ${rows.value.length} driver(s)`);
  } catch (e) {
    error.value = e.message || 'Failed to load drivers';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
}

function go(p) {
  page.value = Math.max(1, p);
  load();
}

function applyFilters() {
  page.value = 1;
  load();
}

function clearFilters() {
  filters.toDownload = undefined;
  filters.status = undefined;
  filters.tagId = undefined;
  filters.labelId = undefined;
  page.value = 1;
  load();
}

onMounted(load);
</script>
