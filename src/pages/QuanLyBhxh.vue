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

    <q-dialog v-model="dialogXemLichSu">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Lịch sử đóng</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="nguoiThamGiaLichSu">
            <p>
              <strong>Họ và tên:</strong>
              {{ nguoiThamGiaLichSu.hoTen }}
            </p>
          </div>

          <div v-if="lichSuDongLoading" class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>

          <q-list
            v-else-if="lichSuDongResult?.lichSuDongBhxh.length"
            bordered
            separator
          >
            <q-item
              v-for="item in lichSuDongResult.lichSuDongBhxh"
              :key="item.id"
            >
              <q-item-section>
                <q-item-label>{{ item.ghiChuDong }}</q-item-label>
                <q-item-label caption>
                  Ngày đóng:
                  {{ new Date(item.ngayLap).toLocaleDateString() }}
                  - Số tiền:
                  {{
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.tongTien)
                  }}
                  -
                  {{ item.hinhThucTt }}
                  - Thu bởi:
                  {{ item.nguoiThu }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center q-my-md">Chưa có lịch sử đóng.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useQuery, useMutation, useLazyQuery } from "@vue/apollo-composable";
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
const dialogXemLichSu = ref(false);
const nguoiThamGiaLichSu = ref(null);

const formLichSu = ref({});
const formNguoiMoi = ref({});

const danhSachTrangThai = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đang tham gia", value: "DANG_THAM_GIA" },
  { label: "Tạm dừng", value: "TAM_DUNG" },
  { label: "Đã nộp", value: "DA_NOP" },
  { label: "Đã thu tiền", value: "DA_THU_TIEN" },
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
      maTraCuu
      lichSuDongDaThuTien{
        id
        ngayLap
        tongTien
      }
    }
  }
`;

const QUERY_LICH_SU_DONG_BHXH = gql`
  query GetLichSuDongBhxh($idNguoiThamGia: Int!) {
    lichSuDongBhxh(idNguoiThamGia: $idNguoiThamGia) {
      id
      ngayLap
      tongTien
      hinhThucTt
      ghiChuDong
      nguoiThu
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

const {
  result: lichSuDongResult,
  load: loadLichSuDong,
  loading: lichSuDongLoading,
} = useLazyQuery(QUERY_LICH_SU_DONG_BHXH);

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
  const soThang = nguoiThamGia.soThangDong;
  const ngayHetHan = new Date();
  ngayHetHan.setMonth(ngayHetHan.getMonth() + soThang);

  formLichSu.value = {
    maSoBhxh: nguoiThamGia.maSoBhxh,
    tenNguoiThamGia: nguoiThamGia.hoTen,
    soThang: soThang,
    soTien: nguoiThamGia.soTien,
    phuongThuc: "Chuyen khoan",
    ngayHetHanBhxh: ngayHetHan.toISOString().split('T')[0],
    maTraCuu: "", // Initialize as empty
    tuThangNam: new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
  };
  dialogThemLichSu.value = true;
};

const moDialogXemLichSu = (nguoiThamGia) => {
  nguoiThamGiaLichSu.value = nguoiThamGia;
  loadLichSuDong(null, { idNguoiThamGia: parseInt(nguoiThamGia.id, 10) });
  dialogXemLichSu.value = true;
};

const xuLyThemLichSu = () => {
  $q.loading.show({ message: "Đang ghi nhận..." });
  const { tenNguoiThamGia, ...input } = formLichSu.value;
  themLichSuDong({ input });
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
