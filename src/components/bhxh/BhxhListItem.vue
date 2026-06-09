<template>
  <q-card>
    <!-- CARD HEADER -->
    <q-card-section class="bg-grey-3 row items-center justify-between">
      <div class="row items-center">
        <q-avatar
          size="28px"
          color="primary"
          text-color="white"
          icon="person"
          class="q-mr-xs"
        />
        <div class="text-subtitle2 text-bold text-uppercase">
          {{ participant.hoTen }}
        </div>
      </div>
      <div class="row items-center q-gutter-x-xs">
        <q-badge :color="statusColor" text-color="white" class="q-mr-sm">
          {{ statusLabel }}
        </q-badge>
        <q-btn
          size="sm"
          color="secondary"
          icon="history"
          dense
          class="q-px-sm"
          @click="$emit('view-history', participant)"
        >
          <q-tooltip>Xem lịch sử đóng tiền</q-tooltip>
        </q-btn>
        <q-btn
          size="sm"
          color="positive"
          icon="note_add"
          label="Ghi nhận đóng"
          dense
          class="q-px-sm"
          @click="$emit('record-payment', participant)"
        />
      </div>
    </q-card-section>

    <!-- CARD BODY -->
    <q-card-section class="q-pa-md q-gutter-y-sm" style="font-size: 13px">
      <div class="row">
        <span class="col-4 text-grey-8">Mã số BHXH:</span>
        <span class="col-8 text-bold text-primary">{{ participant.maSoBhxh }}</span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Ngày sinh:</span>
        <span class="col-8 text-bold">{{ formattedDob }}</span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Giới tính:</span>
        <span class="col-8">{{ genderText }}</span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">CCCD:</span>
        <span class="col-8 text-bold">{{ participant.cccd }}</span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Mã hộ GĐ:</span>
        <span class="col-8">{{ participant.maHoGd }}</span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Điện thoại:</span>
        <span class="col-8">
          <a :href="`tel:${participant.sdt}`">{{ participant.sdt || "N/A" }}</a>
        </span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Điện thoại 2:</span>
        <span class="col-8">
          <a :href="`tel:${participant.soDienThoai2}`">{{ participant.soDienThoai2 || "N/A" }}</a>
        </span>
      </div>
      <div class="row">
        <span class="col-4 text-grey-8">Địa chỉ:</span>
        <span class="col-8 text-caption">{{ participant.diaChi || "N/A" }}</span>
      </div>

      <q-separator class="q-my-md" />

      <!-- THÔNG TIN ĐÓNG BHXH -->
      <div class="row justify-between items-center text-center">
        <div class="col">
          <div class="text-caption text-grey-8">P.thức đóng</div>
          <div class="text-weight-bold">{{ participant.phuongThucDong }}</div>
        </div>
        <div class="col">
          <div class="text-caption text-grey-8">Số tháng</div>
          <div class="text-weight-bold text-negative">
            {{ participant.soThangDong }}
          </div>
        </div>
        <div class="col">
          <div class="text-caption text-grey-8">Số tiền</div>
          <div class="text-weight-bold text-negative">
            {{ formattedAmount }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  participant: Object,
});

defineEmits(["view-history", "record-payment"]);

const statusMap = {
  DANG_THAM_GIA: { label: "Đang tham gia", color: "positive" },
  TAM_DUNG: { label: "Tạm dừng", color: "warning" },
  DA_NOP: { label: "Đã nộp", color: "info" },
  DA_THU_TIEN: { label: "Đã thu tiền", color: "accent" },
};

const statusInfo = computed(() => statusMap[props.participant.trangThai] || { label: "Không rõ", color: "grey" });
const statusLabel = computed(() => statusInfo.value.label);
const statusColor = computed(() => statusInfo.value.color);

const formattedDob = computed(() => {
  if (!props.participant.ngaySinh) return "N/A";
  const [y, m, d] = props.participant.ngaySinh.split("-");
  return `${d}/${m}/${y}`;
});

const genderText = computed(() => {
  if (props.participant.gioiTinh === 1) return "Nam";
  if (props.participant.gioiTinh === 0) return "Nữ";
  return "N/A";
});

const formattedAmount = computed(() =>
  props.participant.soTien
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        props.participant.soTien
      )
    : "0 đ"
);
</script>
