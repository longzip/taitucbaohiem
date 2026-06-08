<template>
  <q-card class="q-mb-md" v-if="stats">
    <q-card-section class="row q-col-gutter-sm items-center">
      <div class="col-4 text-center">
        <div class="text-h6 text-bold">{{ stats.total }}</div>
        <div class="text-caption">Tổng số thẻ</div>
      </div>
      <div class="col-4 text-center">
        <div class="text-h6 text-bold text-positive">{{ stats.active }}</div>
        <div class="text-caption">Đang hoạt động</div>
      </div>
      <div class="col-4 text-center">
        <div class="text-h6 text-bold text-negative">{{ stats.expired }}</div>
        <div class="text-caption">Đã hết hạn</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({ stats: Object });
</script>
