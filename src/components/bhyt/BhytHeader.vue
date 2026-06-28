<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="row items-center">
      <q-icon name="search" size="md" color="primary" class="q-mr-sm" />
      <div>
        <div class="text-h6 text-bold">Tra Cứu Thông Tin BHYT</div>
        <div class="text-caption text-grey">Tra cứu, quản lý và tái tục thẻ BHYT</div>
      </div>
    </div>

    <div class="row items-center">
        <q-btn
          round
          flat
          color="primary"
          icon="refresh"
          @click="$emit('refresh')"
          :loading="loading"
        >
          <q-tooltip>Làm mới dữ liệu</q-tooltip>
        </q-btn>

        <q-btn
          round
          flat
          color="primary"
          icon="more_vert"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="$emit('copyPhones')">
                <q-item-section>Copy SĐT</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('autoLookup')">
                <q-item-section>Tra cứu tự động</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
    </div>
  </div>
</template>

<script setup>
defineProps({ loading: Boolean });
defineEmits(["refresh", "copyPhones", "autoLookup"]);
</script>
