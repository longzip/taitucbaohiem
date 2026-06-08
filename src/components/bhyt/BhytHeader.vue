<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="row items-center">
      <q-icon name="search" size="md" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-h6 text-bold">Tra Cứu Thông Tin BHYT</div>
        <div class="text-caption text-grey">Tra cứu, quản lý và tái tục thẻ BHYT</div>
      </div>
    </div>
    <q-btn
      round
      flat
      color="primary"
      icon="refresh"
      @click="$emit('refresh')"
      :loading="loading"
    >
      <q-tooltip>Làm mới dữ liệu</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
defineProps({ loading: Boolean });
defineEmits(["refresh"]);
</script>
