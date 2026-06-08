<template>
  <q-card class="cursor-pointer">
    <q-card-section class="bg-grey-2 row items-center justify-between">
      <div class="row items-center">
        <q-avatar size="28px" :color="isCar ? 'blue' : 'green'" text-color="white" :icon="isCar ? 'directions_car' : 'two_wheeler'" class="q-mr-xs" />
        <div class="text-subtitle2 text-bold text-uppercase">{{ contract.bienSoXe }}</div>
      </div>
      <q-badge :color="statusColor">{{ statusText }}</q-badge>
    </q-card-section>

    <q-card-section class="q-pa-sm q-gutter-y-xs" style="font-size: 13px;">
      <div class="text-bold">{{ contract.chuXeHoTen }}</div>
      <div v-if="contract.soDienThoai" class="row items-center">
        <q-icon name="phone" size="xs" class="q-mr-xs" />
        <a :href="`tel:${contract.soDienThoai}`" @click.stop class="text-body2" style="text-decoration: none; color: inherit;">{{ contract.soDienThoai }}</a>
      </div>
      <div v-if="contract.diaChi"><q-icon name="location_on" size="xs" class="q-mr-xs" />{{ contract.diaChi }}</div>
      <div>{{ contract.hangXe }} {{ contract.phienBan }}</div>
      <q-separator class="q-my-xs"/>
      <div class="row justify-between items-center text-center">
        <div class="col">
          <div class="text-caption text-grey-8">Từ ngày</div>
          <div class="text-weight-bold">{{ formattedStartDate }}</div>
        </div>
        <div class="col">
          <div class="text-caption text-grey-8">Đến ngày</div>
          <div class="text-weight-bold text-negative">{{ formattedEndDate }}</div>
        </div>
        <div class="col">
          <div class="text-caption text-grey-8">Phí</div>
          <div class="text-weight-bold">{{ formattedFee }}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  contract: Object,
});

const isCar = computed(() => props.contract.loaiXe === 'Ô tô');

const formattedStartDate = computed(() => formatDate(props.contract.ngayBatDau));
const formattedEndDate = computed(() => formatDate(props.contract.ngayHetHan));
const formattedFee = computed(() => formatCurrency(props.contract.phiBaoHiem));

const statusText = computed(() => {
    const days = props.contract.soNgayConLai;
    if (days < 0) return 'Đã hết hạn';
    if (days <= 30) return `Sắp hết hạn (${days} ngày)`;
    return 'Hiệu lực';
});

const statusColor = computed(() => {
    const days = props.contract.soNgayConLai;
    if (days < 0) return 'negative';
    if (days <= 30) return 'warning';
    return 'positive';
});

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatCurrency(val) {
  return val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : '0 đ';
}
</script>
