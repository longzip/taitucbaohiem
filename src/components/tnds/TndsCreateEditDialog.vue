<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 60vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ isEditMode ? 'Cập nhật thông tin' : 'Thêm mới hợp đồng' }}</div>
      </q-card-section>

      <q-card-section class="q-pa-md q-gutter-y-sm">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6"><q-input :model-value="form.chuXeHoTen" @update:model-value="updateFormField('chuXeHoTen', $event)" dense outlined label="Tên chủ xe (*)" :rules="[val => !!val || 'Vui lòng nhập tên']"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.soDienThoai" @update:model-value="updateFormField('soDienThoai', $event)" dense outlined label="Số điện thoại"/></div>
          <div class="col-12"><q-input :model-value="form.diaChi" @update:model-value="updateFormField('diaChi', $event)" dense outlined label="Địa chỉ"/></div>
          <div class="col-12 col-sm-4"><q-input :model-value="form.bienSoXe" @update:model-value="updateFormField('bienSoXe', $event)" dense outlined label="Biển số xe (*)" :rules="[val => !!val || 'Vui lòng nhập biển số']"/></div>
          <div class="col-12 col-sm-4"><q-select :model-value="form.loaiXe" @update:model-value="updateFormField('loaiXe', $event)" :options="['Ô tô', 'Xe máy']" dense outlined label="Loại xe"/></div>
          <div class="col-12 col-sm-4"><q-input :model-value="form.hangXe" @update:model-value="updateFormField('hangXe', $event)" dense outlined label="Hãng xe"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.soKhung" @update:model-value="updateFormField('soKhung', $event)" dense outlined label="Số khung"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.soMay" @update:model-value="updateFormField('soMay', $event)" dense outlined label="Số máy"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.ngayBatDau" @update:model-value="updateFormField('ngayBatDau', $event)" type="date" dense outlined stack-label label="Ngày bắt đầu"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.ngayHetHan" @update:model-value="updateFormField('ngayHetHan', $event)" type="date" dense outlined stack-label label="Ngày hết hạn (*)" :rules="[val => !!val || 'Vui lòng chọn ngày']"/></div>
          <div class="col-12 col-sm-6"><q-input :model-value="form.phiBaoHiem" @update:model-value="updateFormField('phiBaoHiem', $event)" type="number" dense outlined label="Phí bảo hiểm (*)" :rules="[val => val > 0 || 'Phí phải lớn hơn 0']"/></div>
          <div class="col-12 col-sm-6"><q-select :model-value="form.trangThai" @update:model-value="updateFormField('trangThai', $event)" :options="['Hiệu lực', 'Hết hạn', 'Cần tái tục']" dense outlined label="Trạng thái"/></div>
          <div class="col-12"><q-input :model-value="form.ghiChu" @update:model-value="updateFormField('ghiChu', $event)" type="textarea" dense outlined label="Ghi chú"/></div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Hủy" color="grey" v-close-popup />
        <q-btn :label="isEditMode ? 'Cập Nhật' : 'Lưu'" color="primary" @click="$emit('save')" :loading="isSaving"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
defineProps({
  modelValue: Boolean,
  isEditMode: Boolean,
  isSaving: Boolean,
  form: Object,
});

const emit = defineEmits(['update:modelValue', 'update:form', 'save']);

function updateFormField(field, value) {
  const newForm = { ...props.form, [field]: value };
  emit('update:form', newForm);
}
</script>
