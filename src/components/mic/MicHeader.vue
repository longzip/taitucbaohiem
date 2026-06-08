<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="row items-center">
      <q-icon name="groups" size="md" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-h6 text-bold">Quản Lý Tất Cả Khách Hàng MIC</div>
        <div class="text-caption text-grey">
          Danh sách toàn bộ hợp đồng gốc được lưu trữ trên hệ thống
        </div>
      </div>
    </div>
    <div>
      <q-btn
        color="primary"
        icon="add_circle"
        label="Tạo HĐ Mới"
        @click="$emit('create')"
        class="q-mr-sm"
      >
        <q-tooltip>Tạo hợp đồng MIC mới từ một mã số BHXH</q-tooltip>
      </q-btn>
      <q-btn
        round
        flat
        color="primary"
        icon="refresh"
        @click="$emit('refresh')"
        :loading="loading"
      >
        <q-tooltip>Tải lại toàn bộ từ Database</q-tooltip>
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
