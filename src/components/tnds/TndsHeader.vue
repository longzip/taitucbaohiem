<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="row items-center">
      <q-icon name="directions_car" size="md" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-h6 text-bold">Quản Lý Bảo Hiểm TNDS</div>
        <div class="text-caption text-grey">Danh sách hợp đồng bảo hiểm TNDS ô tô, xe máy</div>
      </div>
    </div>
    <div>
      <q-btn color="primary" icon="add_circle" label="Thêm Mới" @click="$emit('create')" class="q-mr-sm" />
      <q-btn round flat color="primary" icon="refresh" @click="$emit('refresh')" :loading="loading">
        <q-tooltip>Tải lại danh sách</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
});
defineEmits(["create", "refresh"]);
</script>
