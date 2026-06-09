<template>
  <q-card class="q-mb-md">
    <q-card-section class="row q-col-gutter-sm items-center">
      <div class="col-12 col-md-6">
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
            <q-icon
              name="search"
              @click="$emit('search')"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3">
        <q-input
          :model-value="userId"
          @update:model-value="$emit('update:userId', $event)"
          outlined
          dense
          type="number"
          placeholder="Lọc theo ID user"
          @keyup.enter="$emit('search')"
        />
      </div>

      <div class="col-12 col-md-3">
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
        >
          <template v-slot:prepend>
            <q-icon name="filter_alt" />
          </template>
        </q-select>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  searchTerm: String,
  status: String,
  statusOptions: Array,
  userId: [String, Number],
});
defineEmits([
  "update:searchTerm",
  "update:status",
  "update:userId",
  "search",
  "clear",
]);
</script>
