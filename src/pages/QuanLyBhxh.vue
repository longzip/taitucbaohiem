<template>
  <q-page class="q-pa-md">
    <bhxh-header :loading="loading" @add="moDialogThemMoi" @refresh="refetch" />
    <bhxh-filter
      v-model:searchTerm="tuKhoaTimKiem"
      v-model:status="trangThaiChon"
      v-model:userId="userIdSelected"
      :status-options="danhSachTrangThai"
      @search="refetch"
      @clear="xoaTimKiem"
    />
    <div v-if="filterActive" class="q-mb-md q-pa-sm bg-info text-white rounded-borders row items-center">
      <div class="col">
        <span>Đang áp dụng bộ lọc: </span>
        <span v-if="tuKhoaTimKiem" class="q-mr-md">
          <strong>Từ khóa:</strong> {{ tuKhoaTimKiem }}
        </span>
        <span v-if="userIdSelected">
          <strong>User ID:</strong> {{ userIdSelected }}
        </span>
      </div>
      <q-btn flat dense icon="close" @click="xoaTimKiem" />
    </div>

    <div v-if="!loading" class="q-mb-md">
      <strong>Kết quả:</strong> {{ danhSachHienThi.length }} người
    </div>

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
      @delete="xoaLichSu"
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
              <q-item-section side>
                <q-btn v-if="!item.soBienLai"
                  icon="delete"
                  color="negative"
                  flat
                  dense
                  @click="xoaLichSu(item.id)"
                />
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
const userIdSelected = ref(null);
const dialogThemLichSu = ref(false);
const dialogThemMoi = ref(false);
const dialogXemLichSu = ref(false);
const nguoiThamGiaLichSu = ref(null);

const formLichSu = ref({});
const formNguoiMoi = ref({});

const filterActive = computed(() => {
  return tuKhoaTimKiem.value || userIdSelected.value;
});

const danhSachTrangThai = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đang tham gia", value: "TRONG_HAN" },
  { label: "Tạm dừng", value: "TAM_DUNG" },
  { label: "Đã nộp", value: "DA_NOP" },
  { label: "Đã thu tiền", value: "DA_THU_TIEN" },
  { label: "Chậm đóng", value: "CHAM_DONG" },
];

// GRAPHQL
const QUERY_DANH_SACH_BHXH = gql`
  query GetDanhSachBhxh($searchKeyword: String, $userId: Int) {
    danhSachBhxh(searchKeyword: $searchKeyword, userId: $userId) {
      id
      userId
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
      ngayHetHanBhxh
      lichSuDongDaThuTien {
        id
        ngayLap
        tongTien
        hinhThucTt
        ghiChuDong
        maTraCuu
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
      maTraCuu
      ngayDuKienGiaHan
      soBienLai
      trangThaiNhac
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

const MUTATION_XOA_LICH_SU = gql`
  mutation XoaLichSuDongBhxh($id: ID!) {
    xoaLichSuDongBhxh(input: { id: $id }) {
      success
      message
    }
  }
`;

const { result, loading, error, refetch } = useQuery(
  QUERY_DANH_SACH_BHXH,
  () => ({
    searchKeyword: tuKhoaTimKiem.value ? tuKhoaTimKiem.value.trim() : null,
    userId: userIdSelected.value ? parseInt(userIdSelected.value, 10) : null,
  }),
  { fetchPolicy: "network-only" }
);

const {
  result: lichSuDongResult,
  refetch: refetchLichSuDong,
   load: loadLichSuDong,
  loading: lichSuDongLoading,
} = useLazyQuery(QUERY_LICH_SU_DONG_BHXH, null, {
  fetchPolicy: "network-only",
});

const { mutate: themLichSuDong, onDone: onThemLichSuDone } = useMutation(
  MUTATION_THEM_LICH_SU
);
const { mutate: themNguoiMoi, onDone: onThemNguoiMoiDone } = useMutation(
  MUTATION_THEM_NGUOI_MOI
);

const { mutate: xoaLichSuDong, onDone: onXoaLichSuDone } =
  useMutation(MUTATION_XOA_LICH_SU);

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
    $q.notify({
      type: "negative",
      message: result?.message || "Có lỗi xảy ra.",
    });
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
    $q.notify({
      type: "negative",
      message: result?.message || "Có lỗi xảy ra.",
    });
  }
  $q.loading.hide();
});

onXoaLichSuDone(({ data }) => {
  const result = data.xoaLichSuDongBhxh;
  if (result?.success) {
    $q.notify({
      type: "positive",
      message: result.message || "Xóa thành công!",
    });
    refetch();
    // Re-fetch the history if the dialog is still open
    if (dialogXemLichSu.value && nguoiThamGiaLichSu.value) {
      refetchLichSuDong({
        idNguoiThamGia: parseInt(nguoiThamGiaLichSu.value.id, 10),
      });
    }
    if (dialogThemLichSu.value) {
      dialogThemLichSu.value = false;
    }
  } else {
    $q.notify({
      type: "negative",
      message: result?.message || "Có lỗi xảy ra.",
    });
  }
  $q.loading.hide();
});

const moDialogThemLichSu = (nguoiThamGia) => {
  const soThang = nguoiThamGia.soThangDong;

  if (nguoiThamGia.lichSuDongDaThuTien) {
    // UPDATE: Use the existing expiration date from the main participant record.
    formLichSu.value = {
      id: nguoiThamGia.lichSuDongDaThuTien.id,
      maSoBhxh: nguoiThamGia.maSoBhxh,
      tenNguoiThamGia: nguoiThamGia.hoTen,
      soThang: soThang,
      soTien: nguoiThamGia.lichSuDongDaThuTien.tongTien,
      phuongThuc: nguoiThamGia.lichSuDongDaThuTien.hinhThucTt,
      ngayHetHanBhxh: nguoiThamGia.ngayHetHanBhxh
        ? nguoiThamGia.ngayHetHanBhxh.split(" ")[0]
        : "", // Use existing date
      maTraCuu: nguoiThamGia.lichSuDongDaThuTien.maTraCuu,
      tuThangNam: new Date(
        nguoiThamGia.lichSuDongDaThuTien.ngayLap
      ).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
    };
  } else {
    // CREATE: Calculate a new expiration date.
    // Base the calculation on the current expiration date if it's in the future, otherwise use today.
    const baseDate =
      nguoiThamGia.ngayHetHanBhxh &&
      new Date(nguoiThamGia.ngayHetHanBhxh) > new Date()
        ? new Date(nguoiThamGia.ngayHetHanBhxh)
        : new Date();

    const ngayHetHan = new Date(baseDate);
    ngayHetHan.setMonth(ngayHetHan.getMonth() + soThang);

    formLichSu.value = {
      maSoBhxh: nguoiThamGia.maSoBhxh,
      tenNguoiThamGia: nguoiThamGia.hoTen,
      soThang: soThang,
      soTien: nguoiThamGia.soTien,
      phuongThuc: "Chuyen khoan",
      ngayHetHanBhxh: ngayHetHan.toISOString().split("T")[0],
      maTraCuu: "", // Initialize as empty
      tuThangNam: new Date().toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      }),
    };
  }
  dialogThemLichSu.value = true;
};

const moDialogXemLichSu = (nguoiThamGia) => {
  nguoiThamGiaLichSu.value = nguoiThamGia;
   loadLichSuDong(null, {
        idNguoiThamGia: parseInt(nguoiThamGiaLichSu.value.id, 10),
      });
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
  userIdSelected.value = null;
  refetch();
};

const xoaLichSu = (id) => {
  $q.dialog({
    title: "Xác nhận xóa",
    message: "Bạn có chắc chắn muốn xóa lịch sử đóng này không?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.loading.show({ message: "Đang xóa..." });
    xoaLichSuDong({ id });
  });
};
</script>
