<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 450px">
      <q-card-section class="bg-primary text-white row items-center">
        <q-icon name="add_circle" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-bold">
          Thêm Người Tham Gia BHXH Mới
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md q-gutter-y-md">
        <q-input :model-value="participant.hoTen" @update:model-value="$emit('update:participant', {...participant, hoTen: $event})" outlined dense label="Họ và tên" />
        <q-input
          :model-value="participant.maSoBhxh"
           @update:model-value="$emit('update:participant', {...participant, maSoBhxh: $event})"
          outlined
          dense
          label="Mã số BHXH"
        />
        <q-input
          :model-value="participant.ngaySinh"
           @update:model-value="$emit('update:participant', {...participant, ngaySinh: $event})"
          outlined
          dense
          label="Ngày sinh (YYYY-MM-DD)"
        />
        <q-input :model-value="participant.cccd"  @update:model-value="$emit('update:participant', {...participant, cccd: $event})" outlined dense label="Số CCCD" />
        <q-input :model-value="participant.sdt"  @update:model-value="$emit('update:participant', {...participant, sdt: $event})" outlined dense label="Số điện thoại" />
        <q-input :model-value="participant.diaChi"  @update:model-value="$emit('update:participant', {...participant, diaChi: $event})" outlined dense label="Địa chỉ" />
        <q-select
          :model-value="participant.phuongThucDong"
           @update:model-value="$emit('update:participant', {...participant, phuongThucDong: $event})"
          :options="['1 tháng', '3 tháng', '6 tháng', '12 tháng']"
          outlined
          dense
          label="Phương thức đóng"
        />
        <q-input
          :model-value="participant.soTien"
           @update:model-value="$emit('update:participant', {...participant, soTien: $event})"
          type="number"
          outlined
          dense
          label="Số tiền mỗi lần đóng"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
        <q-btn
          unevaluated
          label="Thêm Mới"
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
    participant: Object
});
defineEmits(["update:modelValue", "update:participant", "submit"]);
</script>
