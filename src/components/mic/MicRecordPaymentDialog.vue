<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 350px;">
      <q-card-section class="bg-primary text-white row items-center">
        <q-icon name="note_add" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-bold">{{ isUpdate ? 'Cập nhật' : 'Thêm' }} Lịch Sử Ghi Nhận</div>
      </q-card-section>

      <q-card-section class="q-pa-md q-gutter-y-md">
        <div class="text-body2">
          Khách hàng: <strong class="text-primary">{{ payment.tenKhachHang }}</strong>
        </div>
        <div class="text-caption text-negative text-italic">
          * Hệ thống sẽ ghi nhận lịch sử tính hoa hồng ngay. Số hóa đơn và mã tra cứu có thể bổ sung sau.
        </div>
        <q-input :model-value="payment.soHoaDon" @update:model-value="$emit('update:payment', {...payment, soHoaDon: $event})" outlined dense label="Số Hóa Đơn (Tùy chọn)" />
        <q-input :model-value="payment.maTraCuu" @update:model-value="$emit('update:payment', {...payment, maTraCuu: $event})" outlined dense label="Mã Tra Cứu / QR Code (Tùy chọn)" />
        <q-input :model-value="payment.tiLeHoaHong" @update:model-value="$emit('update:payment', {...payment, tiLeHoaHong: $event})" type="number" outlined dense label="Tỉ lệ hoa hồng (%)" :rules="[val => val >= 0 && val <= 100 || 'Tỉ lệ từ 0 - 100']" />
        <q-select :model-value="payment.phuongThuc" @update:model-value="$emit('update:payment', {...payment, phuongThuc: $event})" :options="['Chuyen khoan', 'Tien mat', 'Vi dien tu']" outlined dense label="Phương thức thanh toán" />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn v-if="isUpdate" flat label="Hủy Thu" color="negative" @click="$emit('cancel-payment')" />
        <q-space v-if="isUpdate" />
        <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
        <q-btn unevaluated :label="isUpdate ? 'Cập Nhật' : 'Ghi Nhận'" color="primary" @click="$emit('submit')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  payment: Object,
});

defineEmits(['update:modelValue', 'update:payment', 'submit', 'cancel-payment']);

const isUpdate = computed(() => !!props.payment.idLog);

</script>
