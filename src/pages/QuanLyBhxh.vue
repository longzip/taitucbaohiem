<template>
  <q-page class="page-quan-ly-bhxh">
    <BhxhHeader
      :total="danhSachBhxh.length"
      v-model:tu-khoa="tuKhoaTimKiem"
      @tim-kiem="refetch()"
      @xoa-tim-kiem="xoaTimKiem"
      @them-moi="moDialogThemMoi"
    />

    <div v-if="loading && !danhSachBhxh.length" class="loading-container">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else>
      <BhxhList
        v-if="danhSachBhxh.length"
        :list="danhSachBhxh"
        @ghi-danh="moDialogThemLichSu"
        @xem-lich-su="moDialogXemLichSu"
      />
      <BhxhEmptyState v-else @them-moi="moDialogThemMoi" />
    </div>

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

    <BhxhAddParticipantDialog
      :model-value="dialogThemMoi"
      :form-nguoi-moi="formNguoiMoi"
      @update:model-value="dialogThemMoi = $event"
      @submit="xuLyThemMoiNguoiThamGia"
    />

    <BhxhRecordPaymentDialog
      :model-value="dialogThemLichSu"
      :form-lich-su="formLichSu"
      @update:model-value="dialogThemLichSu = $event"
      @submit="xuLyThemLichSu"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useMutation, useLazyQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { useQuasar } from "quasar";
import {
  NGUOI_THAM_GIA_BHXH_QUERY,
  THEM_LICH_SU_DONG,
  THEM_NGUOI_THAM_GIA_BHXH,
} from "./graphql";

import BhxhHeader from "src/components/bhxh/BhxhHeader.vue";
import BhxhList from "src/components/bhxh/BhxhList.vue";
import BhxhEmptyState from "src/components/bhxh/BhxhEmptyState.vue";
import BhxhAddParticipantDialog from "src/components/bhxh/BhxhAddParticipantDialog.vue";
import BhxhRecordPaymentDialog from "src/components/bhxh/BhxhRecordPaymentDialog.vue";

const $q = useQuasar();

const tuKhoaTimKiem = ref("");
const dialogThemLichSu = ref(false);
const dialogThemMoi = ref(false);
const dialogXemLichSu = ref(false);
const nguoiThamGiaLichSu = ref(null);

const LICH_SU_DONG_BHXH_QUERY = gql`
  query LichSuDongBhxhQuery($idNguoiThamGia: Int!) {
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

const {
  result: lichSuDongResult,
  load: loadLichSuDong,
  loading: lichSuDongLoading,
} = useLazyQuery(LICH_SU_DONG_BHXH_QUERY);

const moDialogXemLichSu = (nguoiThamGia) => {
  nguoiThamGiaLichSu.value = nguoiThamGia;
  loadLichSuDong(undefined, { idNguoiThamGia: parseInt(nguoiThamGia.id, 10) });
  dialogXemLichSu.value = true;
};

const formLichSu = ref(null);
const formNguoiMoi = ref(null);

const { result, loading, refetch } = useQuery(NGUOI_THAM_GIA_BHXH_QUERY, {
  searchKeyword: tuKhoaTimKiem,
});

const danhSachBhxh = computed(() => result.value?.danhSachBhxh ?? []);

const { mutate: themLichSuDong, onDone: onThemLichSuDong } = useMutation(
  THEM_LICH_SU_DONG,
  {
    refetchQueries: [
      { query: NGUOI_THAM_GIA_BHXH_QUERY, variables: { searchKeyword: "" } },
    ],
  }
);
onThemLichSuDong(() => {
  $q.loading.hide();
  $q.notify({
    message: "Ghi nhận lịch sử thành công",
    color: "positive",
  });
  dialogThemLichSu.value = false;
});

const { mutate: themNguoiMoi, onDone: onThemNguoiMoi } = useMutation(
  THEM_NGUOI_THAM_GIA_BHXH,
  {
    refetchQueries: [
      { query: NGUOI_THAM_GIA_BHXH_QUERY, variables: { searchKeyword: "" } },
    ],
  }
);

onThemNguoiMoi(() => {
  $q.loading.hide();
  $q.notify({
    message: "Thêm người tham gia thành công",
    color: "positive",
  });
  dialogThemMoi.value = false;
});

const moDialogThemLichSu = (nguoiThamGia) => {
  formLichSu.value = {
    idNguoiThamGia: parseInt(nguoiThamGia.id, 10),
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
