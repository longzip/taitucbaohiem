<template>
  <q-card class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <div class="col-12 col-md-8">
        <q-input
          :model-value="searchTerm"
          @update:model-value="$emit('update:searchTerm', $event)"
          outlined
          dense
          placeholder="Tìm theo biển số xe, tên chủ xe..."
          clearable
          @clear="$emit('clear')"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" />
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
          label="Lọc theo trạng thái"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  searchTerm: String,
  status: String,
  statusOptions: Array,
});
defineEmits(["update:searchTerm", "update:status", "clear"]);
</script>
