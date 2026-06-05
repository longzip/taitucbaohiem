<template>
  <q-page class="q-pa-md">
    <!-- Page Title & Refresh Button -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="search" size="md" color="primary" class="q-mr-sm" />
        <div>
          <div class="text-h6 text-bold">Tra Cứu Hồ Sơ BHXH</div>
          <div class="text-caption text-grey">Tra cứu thông tin người tham gia BHXH tự nguyện</div>
        </div>
      </div>
      <q-btn round flat color="primary" icon="refresh" @click="refetch()" :loading="loading">
        <q-tooltip>Tải lại danh sách</q-tooltip>
      </q-btn>
    </div>

    <!-- Search Card -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-input
          v-model="searchTerm"
          outlined
          dense
          placeholder="Tìm theo Mã số BHXH, tên, hoặc CMND..."
          clearable
          @clear="searchTerm = ''"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="column items-center justify-center q-my-xl text-red">
      <q-icon name="error_outline" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Lỗi khi tải dữ liệu. Vui lòng thử lại.</div>
      <div class="text-caption text-grey">{{ error.message }}</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredHoSo.length === 0" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="person_search" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không tìm thấy hồ sơ phù hợp</div>
    </div>

    <!-- Grid View -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="hoso in filteredHoSo" :key="hoso.maSoBhxh" class="col-12 col-md-6 col-lg-4">
        <q-card>
          <q-card-section class="bg-grey-2 row items-center justify-between">
            <div class="row items-center">
              <q-avatar size="28px" color="primary" text-color="white" icon="person" class="q-mr-sm" />
              <div class="text-subtitle2 text-bold">{{ hoso.hoTen }}</div>
            </div>
            <q-btn
              flat
              round
              dense
              color="secondary"
              icon="history"
              @click.stop="showHistoryDialog(hoso)"
              :disable="!hoso.lichSuThanhToan || hoso.lichSuThanhToan.length === 0"
            >
              <q-tooltip>Xem Lịch sử Giao dịch</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section class="q-pa-sm q-gutter-y-xs" style="font-size: 13px;">
            <div class="row"><span class="col-4 text-grey-8">MSBHXH:</span><span class="col-8 text-bold text-primary">{{ hoso.maSoBhxh }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">Ngày sinh:</span><span class="col-8 text-bold">{{ hoso.ngaySinh }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">CMND/CCCD:</span><span class="col-8">{{ hoso.cmnd }}</span></div>
            <div v-if="hoso.soDienThoai" class="row"><span class="col-4 text-grey-8">Điện thoại:</span><span class="col-8"><a :href="`tel:${hoso.soDienThoai}`" class="text-body2">{{ hoso.soDienThoai }}</a></span></div>
            <div v-if="hoso.diaChi" class="row"><span class="col-4 text-grey-8">Địa chỉ:</span><span class="col-8 text-caption">{{ hoso.diaChi }}</span></div>

            <q-separator class="q-my-sm"/>

            <div class="row"><span class="col-4 text-grey-8">Mức đóng:</span><span class="col-8 text-bold text-negative">{{ formatCurrency(hoso.mucTienDong) }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">Phương thức:</span><span class="col-8">{{ hoso.phuongThucDong }}</span></div>
             <div v-if="hoso.tenDonViBhxh" class="row"><span class="col-4 text-grey-8">Đơn vị:</span><span class="col-8 text-caption">{{ hoso.tenDonViBhxh }}</span></div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- History Dialog -->
    <q-dialog v-model="isHistoryDialogVisible" persistent>
      <q-card style="width: 90vw; max-width: 600px;">
        <q-card-section class="bg-secondary text-white row items-center">
           <q-icon name="history" size="sm" class="q-mr-sm" />
          <div class="text-h6">Lịch sử giao dịch</div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
           <div v-if="selectedHoso" class="text-subtitle1">{{ selectedHoso.hoTen }} - <strong>{{ selectedHoso.maSoBhxh }}</strong></div>
        </q-card-section>

        <q-card-section style="max-height: 60vh" class="scroll q-pt-none">
          <div v-if="!selectedHoso || !selectedHoso.lichSuThanhToan || selectedHoso.lichSuThanhToan.length === 0" class="text-center q-pa-md text-grey-7">
            <q-icon name="hourglass_empty" size="lg" />
            <div>Không có lịch sử giao dịch.</div>
          </div>
          <q-list separator v-else>
            <q-item v-for="tx in selectedHoso.lichSuThanhToan" :key="tx.id">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ tx.noiDung }}</q-item-label>
                <q-item-label caption>Ngày lập: {{ tx.ngayLap }}</q-item-label>
                <q-item-label caption>Trạng thái: {{ tx.trangThaiHoSoName }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                 <q-item-label class="text-weight-bold text-positive">{{ formatCurrency(tx.tongTien) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_ALL_HOSO = gql`
  query GetAllHoSo {
    hoSoBHXH {
      maSoBhxh
      hoTen
      ngaySinh
      cmnd
      soDienThoai
      email
      diaChi
      hoGiaDinh
      ngayDk
      maDonViBhxh
      tenDonViBhxh
      phuongAn
      mucTienDong
      phuongThucDong
      tuThangNam
      thoiGianNhacDong
      tiLeHoaHong
      ghiChu
      lichSuThanhToan {
        id
        bienLaiId
        ngayLap
        trangThaiHoSoName
        tongTien
        tienHoaHong
        nguoiNop
        noiDung
        maTraCuuQr
      }
    }
  }
`;

const searchTerm = ref('');
const isHistoryDialogVisible = ref(false);
const selectedHoso = ref(null);

const { result, loading, error, refetch } = useQuery(GET_ALL_HOSO, null, { fetchPolicy: 'cache-and-network' });

const allHoSo = computed(() => (result.value ? result.value.hoSoBHXH : []));

const filteredHoSo = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) {
    return allHoSo.value;
  }
  return allHoSo.value.filter(hoso =>
    hoso.maSoBhxh?.toLowerCase().includes(term) ||
    hoso.hoTen?.toLowerCase().includes(term) ||
    (hoso.cmnd && hoso.cmnd.toLowerCase().includes(term))
  );
});

const showHistoryDialog = (hoso) => {
  selectedHoso.value = hoso;
  isHistoryDialogVisible.value = true;
};

const formatCurrency = (value) => {
  if (isNaN(value) || value === null) {
    return '0 đ';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>
