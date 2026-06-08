<template>
  <q-page class="q-pa-md">
    <bhxh-header
      :loading="loading"
      @add="moDialogThemMoi"
      @refresh="refetch"
    />
    <bhxh-filter
      v-model:searchTerm="tuKhoaTimKiem"
      v-model:status="trangThaiChon"
      :status-options="danhSachTrangThai"
      @search="refetch"
      @clear="xoaTimKiem"
    />
    <bhxh-list :items="danhSachHienThi" :loading="loading">
      <template #default="{ item }">
        <bhxh-list-item
          :participant="item"
          @view-history="moDialogXemLichSu"
          @record-payment="moDialogThemLichSu"
        />
      </template>
    </bhxh-list>
    <bhxh-record-payment-dialog
      v-model="dialogThemLichSu"
      v-model:payment="formLichSu"
      @submit="xuLyThemLichSu"
    />
    <bhxh-add-participant-dialog
      v-model="dialogThemMoi"
      v-model:participant="formNguoiMoi"
      @submit="xuLyThemMoiNguoiThamGia"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

import BhxhHeader from "src/components/bhxh/BhxhHeader.vue";
import BhxhFilter from "src/components/bhxh/BhxhFilter.vue";
import BhxhList from "src/components/bhxh/BhxhList.vue";
import BhxhListItem from "src/components/bhxh/BhxhListItem.vue";
import BhxhRecordPaymentDialog from "src/components/bhxh/BhxhRecordPaymentDialog.vue";
import BhxhAddParticipantDialog from "src/components/bhxh/BhxhAddParticipantDialog.vue";

const $q = useQuasar();

// STATES DỮ LIỆU
const tuKhoaTimKiem = ref("");
const trangThaiChon = ref("ALL");
const dialogThemLichSu = ref(false);
const dialogThemMoi = ref(false);

const formLichSu = ref({});
const formNguoiMoi = ref({});

const danhSachTrangThai = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đang tham gia", value: "DANG_THAM_GIA" },
  { label: "Tạm dừng", value: "TAM_DUNG" },
];

// GRAPHQL
const QUERY_DANH_SACH_BHXH = gql`
  query GetDanhSachBhxh($searchKeyword: String) {
    danhSachBhxh(searchKeyword: $searchKeyword) {
      id
      hoTen
      maSoBhxh
      ngaySinh
      gioiTinh
      cccd
      maHoGd
      sdt
      soDienThoai2
      diaChi
      phuongThucDong
      soThangDong
      soTien
      trangThai
    }
  }
`;

const MUTATION_THEM_LICH_SU = gql`
  mutation ThemDongBhxh($input: ThemDongBhxhInput!) {
    themDongBhxh(input: $input) {
      success
      message
    }
  }
`;
const MUTATION_THEM_NGUOI_MOI = gql`
  mutation ThemNguoiThamGiaBhxh($input: ThemNguoiThamGiaBhxhInput!) {
    themNguoiThamGiaBhxh(input: $input) {
      success
      message
    }
  }
`;

const { result, loading, error, refetch } = useQuery(
  QUERY_DANH_SACH_BHXH,
  () => ({ searchKeyword: tuKhoaTimKiem.value ? tuKhoaTimKiem.value.trim() : null }),
  { fetchPolicy: "network-only" }
);

const { mutate: themLichSuDong, onDone: onThemLichSuDone } = useMutation(
  MUTATION_THEM_LICH_SU
);
const { mutate: themNguoiMoi, onDone: onThemNguoiMoiDone } = useMutation(
  MUTATION_THEM_NGUOI_MOI
);

const danhSachGoc = computed(() => result.value?.danhSachBhxh ?? []);

const danhSachHienThi = computed(() => {
  if (trangThaiChon.value === "ALL") {
    return danhSachGoc.value;
  }
  return danhSachGoc.value.filter(
    (item) => item.trangThai === trangThaiChon.value
  );
});

onThemLichSuDone(({ data }) => {
  const result = data.themDongBhxh;
  if (result?.success) {
    $q.notify({
      type: "positive",
      message: result.message || "Ghi nhận thành công!",
    });
    dialogThemLichSu.value = false;
    refetch();
  } else {
    $q.notify({ type: "negative", message: result?.message || "Có lỗi xảy ra." });
  }
  $q.loading.hide();
});

onThemNguoiMoiDone(({ data }) => {
  const result = data.themNguoiThamGiaBhxh;
  if (result?.success) {
    $q.notify({
      type: "positive",
      message: result.message || "Thêm người tham gia thành công!",
    });
    dialogThemMoi.value = false;
    refetch();
  } else {
    $q.notify({ type: "negative", message: result?.message || "Có lỗi xảy ra." });
  }
  $q.loading.hide();
});

const moDialogThemLichSu = (nguoiThamGia) => {
  formLichSu.value = {
    idNguoiThamGia: nguoiThamGia.id,
    tenNguoiThamGia: nguoiThamGia.hoTen,
    soThang: nguoiThamGia.soThangDong,
    soTien: nguoiThamGia.soTien,
    phuongThuc: "Chuyen khoan",
  };
  dialogThemLichSu.value = true;
};

const xuLyThemLichSu = () => {
  $q.loading.show({ message: "Đang ghi nhận..." });
  themLichSuDong({ input: formLichSu.value });
};

const moDialogThemMoi = () => {
  formNguoiMoi.value = {
    phuongThucDong: "3 tháng",
  };
  dialogThemMoi.value = true;
};

const xuLyThemMoiNguoiThamGia = () => {
  $q.loading.show({ message: "Đang thêm người tham gia..." });
  themNguoiMoi({ input: formNguoiMoi.value });
};

const xoaTimKiem = () => {
  tuKhoaTimKiem.value = "";
  refetch();
};

</script>
