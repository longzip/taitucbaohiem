<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 350px;">
      <q-card-section class="bg-primary text-white row items-center">
        <q-icon name="add_circle" size="sm" class="q-mr-sm" />
        <div class="text-subtitle1 text-bold">Tạo Hợp Đồng MIC từ BHYT</div>
      </q-card-section>

      <q-card-section class="q-pa-md q-gutter-y-md">
         <div class="text-caption text-grey-8">
          Nhập Mã số BHXH của khách hàng đã có trong danh bạ BHYT để tạo hợp đồng MIC mới.
        </div>
        <q-input
          :model-value="maSoBhxh"
          @update:model-value="$emit('update:maSoBhxh', $event)"
          outlined
          dense
          label="Mã số BHXH"
          autofocus
          @keyup.enter="$emit('submit')"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
        <q-btn
          unevaluated
          label="Tạo Hợp Đồng"
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
  maSoBhxh: String,
});
defineEmits(["update:modelValue", "update:maSoBhxh", "submit"]);
</script>
