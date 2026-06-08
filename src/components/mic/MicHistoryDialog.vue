<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 500px;">
      <q-card-section class="bg-secondary text-white row items-center">
        <q-icon name="history" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-bold">Lịch Sử Ghi Nhận</div>
      </q-card-section>

      <q-card-section v-if="history">
        <div class="text-subtitle2 q-mb-md">
          Khách hàng: <strong class="text-primary">{{ history.ndbhHoTen }}</strong>
        </div>
        <q-list bordered separator dense>
          <q-item
            v-for="log in history.lichSuThanhToan"
            :key="log.idLog"
            class="q-py-sm"
          >
            <q-item-section>
              <q-item-label class="text-bold">{{ formatDateTime(log.ngayThu) }} - {{ log.nhanVienThu }}</q-item-label>
              <q-item-label caption>
                Trạng thái: <strong>{{ log.trangThaiNopTien }}</strong> | Phí: {{ formatCurrency(log.soTienGoc) }}
              </q-item-label>
              <q-item-label caption v-if="log.tienHoaHongTichLuy > 0">
                Hoa hồng: <strong class="text-positive">{{ formatCurrency(log.tienHoaHongTichLuy) }}</strong>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="!history.lichSuThanhToan || history.lichSuThanhToan.length === 0" class="text-center text-grey q-pa-md">
          Chưa có lịch sử ghi nhận nào.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Đóng" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  history: Object,
});

defineEmits(["update:modelValue"]);

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(value) {
  return value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '0 đ';
}
</script>
