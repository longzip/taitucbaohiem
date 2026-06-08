<template>
  <q-card>
    <!-- CARD HEADER -->
    <q-card-section class="bg-grey-3 row items-center justify-between">
      <div class="row items-center">
        <q-avatar size="28px" color="primary" text-color="white" icon="person" class="q-mr-xs" />
        <div class="text-subtitle2 text-bold text-uppercase">
          {{ contract.ndbhHoTen }}
        </div>
      </div>
      <div class="row items-center q-gutter-x-xs">
        <q-btn size="sm" color="secondary" icon="history" dense class="q-px-sm" @click="$emit('view-history', contract)">
          <q-tooltip>Xem lịch sử ghi nhận thanh toán</q-tooltip>
        </q-btn>
        <q-btn size="sm" color="positive" icon="note_add" label="Ghi nhận" dense class="q-px-sm" @click="$emit('record-payment', contract)" />
        <q-btn v-if="contract.trangThaiDon === 'Da thu tien' && contract.lichSuChuaDuyet" dense flat size="md" class="q-px-sm text-white" :style="{ backgroundColor: contractStatusColor }" @click="$emit('update-payment', contract)">
          Chờ biên lai ({{ contract.lichSuChuaDuyet.tiLeHoaHong }}% HH)
          <q-tooltip>Bấm để cập nhật thông tin biên lai</q-tooltip>
        </q-btn>
        <q-badge v-else :color="contractStatusColor">
          {{ contractStatusText }}
        </q-badge>
      </div>
    </q-card-section>

    <!-- CARD BODY -->
    <q-card-section class="q-pa-md q-gutter-y-sm" style="font-size: 13px;">
      <div class="text-caption text-uppercase text-grey-7 q-mb-xs">Người được bảo hiểm</div>

      <div class="row"><span class="col-4 text-grey-8">Số HĐ MIC:</span><span class="col-8 text-bold text-primary">{{ contract.soHopDongMic || 'Chưa có' }}</span></div>
      <div class="row"><span class="col-4 text-grey-8">Ngày sinh:</span><span class="col-8 text-bold">{{ formattedDob }}</span></div>
      <div class="row"><span class="col-4 text-grey-8">CCCD:</span><span class="col-8 text-bold">{{ contract.ndbhCccd }}</span></div>
      <div class="row"><span class="col-4 text-grey-8">Giới tính:</span><span class="col-8">{{ contract.ndbhGioiTinh || 'N/A' }}</span></div>
      <div class="row"><span class="col-4 text-grey-8">Điện thoại:</span><span class="col-8"><a :href="`tel:${contract.ndbhSdt}`">{{ contract.ndbhSdt || 'N/A' }}</a></span></div>
      <div class="row"><span class="col-4 text-grey-8">Email:</span><span class="col-8 text-caption" style="word-break: break-all;">{{ contract.ndbhEmail || 'N/A' }}</span></div>
      <div class="row"><span class="col-4 text-grey-8">Địa chỉ:</span><span class="col-8 text-caption">{{ contract.ndbhDiaChi || 'N/A' }}</span></div>

      <!-- THÔNG TIN NGƯỜI MUA BẢO HIỂM -->
      <div v-if="contract.nmbhHoTen" class="q-mt-md">
        <q-separator />
        <div class="text-caption text-uppercase text-grey-7 q-mt-sm q-mb-xs">Người mua bảo hiểm</div>
        <div class="row"><span class="col-4 text-grey-8">Họ tên:</span><span class="col-8 text-bold">{{ contract.nmbhHoTen }}</span></div>
        <div class="row"><span class="col-4 text-grey-8">Điện thoại:</span><span class="col-8"><a :href="`tel:${contract.nmbhSdt}`">{{ contract.nmbhSdt || 'N/A' }}</a></span></div>
        <div class="row"><span class="col-4 text-grey-8">Địa chỉ:</span><span class="col-8 text-caption">{{ contract.nmbhDiaChi || 'N/A' }}</span></div>
      </div>

      <q-separator class="q-my-md" />

      <!-- THÔNG TIN GÓI BẢO HIỂM -->
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
          <div class="text-caption text-grey-8">Phí BH</div>
          <div class="text-weight-bold text-negative">{{ formattedFee }}</div>
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

defineEmits(['view-history', 'record-payment', 'update-payment']);

const formattedDob = computed(() => formatDate(props.contract.ndbhNgaySinh));
const formattedStartDate = computed(() => formatDate(props.contract.ngayBatDau));
const formattedEndDate = computed(() => formatDate(props.contract.ngayHetHan));
const formattedFee = computed(() => formatCurrency(props.contract.mucPhi));

const contractStatusText = computed(() => {
  const { trangThaiDon, soNgayConLai } = props.contract;
  if (trangThaiDon === 'Da thu tien') return 'Chờ biên lai';
  if (soNgayConLai < 0) return 'Đã hết hạn';
  if (soNgayConLai <= 30) return `Sắp hết hạn (${soNgayConLai} ngày)`;
  return 'Hiệu lực';
});

const contractStatusColor = computed(() => {
  const { trangThaiDon, soNgayConLai } = props.contract;
  if (trangThaiDon === 'Da thu tien') return 'orange';
  if (soNgayConLai < 0) return 'negative';
  if (soNgayConLai <= 30) return 'warning';
  return 'positive';
});

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const [y, m, d] = dateString.split('-');
  return `${d}/${m}/${y}`;
}

function formatCurrency(value) {
  return value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '0 đ';
}
</script>
