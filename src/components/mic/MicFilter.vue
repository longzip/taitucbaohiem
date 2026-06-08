<template>
  <q-card class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <div class="col-12 col-md-8">
        <q-input
          :model-value="searchTerm"
          @update:model-value="$emit('update:searchTerm', $event)"
          outlined
          dense
          placeholder="Gõ để tìm kiếm và bấm Enter hoặc icon..."
          @keyup.enter="$emit('search')"
          clearable
          @clear="$emit('clear')"
        >
          <template v-slot:append>
            <q-icon name="search" @click="$emit('search')" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <q-select
          :model-value="status"
          @update:model-value="$emit('update:status', $event)"
          :options="statusOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          label="Lọc theo trạng thái đơn"
        >
          <template v-slot:prepend>
            <q-icon name="filter_alt" />
          </template>
        </q-select>
      </div>
    </q-card-section>

    <q-card-section v-if="searchTerm || status !== 'ALL'" class="bg-grey-2 row items-center justify-between text-caption q-px-md">
      <div>
        Đang áp dụng bộ lọc kết hợp:
        <strong v-if="searchTerm">Từ khóa "{{ searchTerm }}" </strong>
        <strong v-if="status !== 'ALL'">+ Trạng thái: {{ statusLabel }}</strong>
      </div>
      <q-badge color="primary">Khớp: {{ matchCount }} dòng</q-badge>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  searchTerm: String,
  status: String,
  statusOptions: Array,
  matchCount: Number,
});

defineEmits([
  "update:searchTerm",
  "update:status",
  "search",
  "clear",
]);

const statusLabel = computed(() => {
  const selected = props.statusOptions.find(opt => opt.value === props.status);
  return selected ? selected.label : '';
});
</script>
