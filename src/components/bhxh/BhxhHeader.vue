<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="row items-center">
      <q-icon name="groups" size="md" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-h6 text-bold">Quản Lý BHXH Tự Nguyện</div>
        <div class="text-caption text-grey">
          Danh sách người tham gia BHXH tự nguyện
        </div>
      </div>
    </div>
    <div>
      <q-btn
        color="primary"
        icon="add_circle"
        label="Thêm Người Mới"
        @click="$emit('add')"
        class="q-mr-sm"
      >
        <q-tooltip>Thêm một người tham gia BHXH mới</q-tooltip>
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
defineEmits(["add", "refresh"]);
</script>
