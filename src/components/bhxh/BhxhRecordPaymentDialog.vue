<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ payment.id ? "Cập nhật ghi nhận" : "Ghi nhận đóng mới" }}
        </div>
      </q-card-section>

      <q-form @submit.prevent="submitForm">
        <q-card-section class="q-pa-md q-gutter-y-md">
          <div class="text-body2">
            Người tham gia:
            <strong class="text-primary">{{ payment.tenNguoiThamGia }}</strong>
          </div>
          <q-input
            :model-value="payment.soThang"
            @update:model-value="$emit('update:payment', {...payment, soThang: parseInt($event, 10)})"
            type="number"
            outlined
            dense
            label="Số tháng đóng"
            :rules="[(val) => val > 0 || 'Số tháng phải lớn hơn 0']"
          />
          <q-input
            :model-value="payment.ngayHetHanBhxh"
            outlined
            dense
            label="Ngày hết hạn BHXH"
            readonly
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="payment.ngayHetHanBhxh"
                    @update:model-value="$emit('update:payment', {...payment, ngayHetHanBhxh: $event})"
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Đóng" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            :model-value="payment.soTien"
            @update:model-value="$emit('update:payment', {...payment, soTien: parseFloat($event)})"
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

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            v-if="payment.id"
            color="negative"
            flat
            label="Xóa"
            @click="$emit('delete', payment.id)"
          />
          <q-space v-if="payment.id" />
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn type="submit" color="primary" :label="payment.id ? 'Cập nhật' : 'Ghi nhận'" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  payment: Object,
});

const emit = defineEmits(["update:modelValue", "update:payment", "submit", "delete"]);

const submitForm = () => {
  emit("submit");
};
</script>
