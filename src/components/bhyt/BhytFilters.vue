<template>
  <q-card class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <div class="col-12 col-md-5">
        <q-input
          :model-value="searchText"
          @update:model-value="$emit('update:searchText', $event)"
          outlined
          dense
          placeholder="Gõ để tìm kiếm (Họ tên, Mã số BHXH, Thẻ BHYT)..."
          @keyup.enter="$emit('search')"
          clearable
          @clear="$emit('update:searchText', null)"
        >
          <template v-slot:append>
            <q-icon name="search" @click="$emit('search')" class="cursor-pointer" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <q-select
          :model-value="selectedUser"
          @update:model-value="$emit('update:selectedUser', $event)"
          :options="userOptions"
          label="Lọc theo người dùng"
          outlined
          dense
          emit-value
          map-options
          clearable
        >
           <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-select>
      </div>

      <div class="col-12 col-md-3">
        <q-select
          :model-value="selectedStatus"
          @update:model-value="$emit('update:selectedStatus', $event)"
          :options="statusOptions"
          label="Lọc theo trạng thái"
          outlined
          dense
          emit-value
          map-options
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="filter_alt" />
          </template>
        </q-select>
      </div>
    </q-card-section>
    <slot name="summary"></slot>
  </q-card>
</template>

<script setup>
defineProps({
  searchText: String,
  selectedUser: String,
  selectedStatus: String,
  userOptions: Array,
  statusOptions: Array,
});

defineEmits([
  "update:searchText",
  "update:selectedUser",
  "update:selectedStatus",
  "search",
]);
</script>
