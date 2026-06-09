<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="bg-primary text-white row items-center">
        <q-icon name="note_add" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-bold">Ghi Nhận Đóng Tiền BHXH</div>
      </q-card-section>

      <q-card-section class="q-pa-md q-gutter-y-md">
        <div class="text-body2">
          Người tham gia:
          <strong class="text-primary">{{ payment.tenNguoiThamGia }}</strong>
        </div>
        <q-input
          :model-value="payment.soThang"
           @update:model-value="$emit('update:payment', {...payment, soThang: $event})"
          type="number"
          outlined
          dense
          label="Số tháng đóng"
          :rules="[(val) => val > 0 || 'Số tháng phải lớn hơn 0']"
        />
        <q-input
          :model-value="payment.soTien"
           @update:model-value="$emit('update:payment', {...payment, soTien: $event})"
          type="number"
          outlined
          dense
          label="Số tiền đóng"
          :rules="[(val) => val > 0 || 'Số tiền phải lớn hơn 0']"
        />
        <q-input
          :model-value="payment.tuThangNam"
           @update:model-value="$emit('update:payment', {...payment, tuThangNam: $event})"
          outlined
          dense
          label="Kỳ đóng (MM/YYYY)"
        />
        <q-input
          :model-value="payment.maTraCuu"
           @update:model-value="$emit('update:payment', {...payment, maTraCuu: $event})"
          outlined
          dense
          label="Mã tra cứu (nếu có)"
        />
        <q-select
          :model-value="payment.phuongThuc"
           @update:model-value="$emit('update:payment', {...payment, phuongThuc: $event})"
          :options="['Chuyen khoan', 'Tien mat', 'Vi dien tu']"
          outlined
          dense
          label="Phương thức thanh toán"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
        <q-btn
          unevaluated
          label="Ghi Nhận"
          color="primary"
          @click="$emit('submit')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
    modelValue: Boolean,
    payment: Object
});
defineEmits(["update:modelValue", "update:payment", "submit"]);
</script>
