<template>
  <q-card-section v-if="hasFilters" class="bg-grey-2 row items-center justify-between text-caption q-px-md q-py-sm">
    <div>
      Đang áp dụng bộ lọc:
      <strong v-if="searchText">Từ khóa "{{ searchText }}" </strong>
      <strong v-if="selectedUser">| Người dùng: {{ selectedUser }} </strong>
      <strong v-if="selectedStatus">| Trạng thái: {{ selectedStatus }}</strong>
    </div>
    <q-badge color="primary">Tìm thấy: {{ count }} thẻ</q-badge>
  </q-card-section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  searchText: String,
  selectedUser: String,
  selectedStatus: String,
  count: Number,
});

const hasFilters = computed(() => props.searchText || props.selectedUser || props.selectedStatus);
</script>
