<template>
  <!-- TRẠNG THÁI LOADING -->
  <div v-if="loading" class="row justify-center q-my-xl">
    <q-spinner color="primary" size="40px" />
  </div>
  <!-- TRẠNG THÁI LỖI -->
  <div v-else-if="error" class="column items-center justify-center q-my-xl text-negative">
    <q-icon name="error" size="64px" />
    <div class="text-subtitle1 q-mt-sm">Lỗi khi tải dữ liệu: {{ error.message }}</div>
    <q-btn label="Thử lại" @click="$emit('refetch')" color="primary" class="q-mt-md"/>
  </div>
  <!-- TRẠNG THÁI DANH SÁCH TRỐNG -->
  <div v-else-if="!bhyts || !bhyts.length" class="column items-center justify-center q-my-xl text-grey">
    <q-icon name="person_search" size="64px" />
    <div class="text-subtitle1 q-mt-sm">Không tìm thấy kết quả nào.</div>
     <div class="text-caption">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
  </div>

  <!-- LƯỚI HIỂN THỊ KẾT QUẢ -->
  <div v-else class="row q-col-gutter-md">
    <div
      v-for="bhyt in bhyts"
      :key="bhyt.id"
      class="col-12 col-md-6"
    >
      <ThongTinTheBHYT :bhyt="bhyt" />
    </div>
  </div>
</template>

<script setup>
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";

defineProps({ 
  bhyts: Array,
  loading: Boolean,
  error: Object,
});

defineEmits(['refetch'])
</script>

<style scoped>
.q-card {
  transition: box-shadow 0.3s;
}
.q-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
