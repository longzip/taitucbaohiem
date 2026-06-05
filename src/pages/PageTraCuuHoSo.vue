<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h4 class="text-h4">Danh sách Người tham gia BHXH tự nguyện</h4>
          <p>Nhập Mã số BHXH, tên, hoặc CMND để lọc danh sách bên dưới.</p>

          <q-input
            v-model="searchTerm"
            label="Lọc theo Mã số BHXH, tên, CMND..."
            outlined
            clearable
            class="q-mb-md bg-white"
          />

          <div v-if="loading" class="text-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
            <p>Đang tải danh sách...</p>
          </div>

          <div v-if="error" class="q-my-md">
            <q-banner inline-actions class="text-white bg-red">
              <template v-slot:avatar>
                <q-icon name="error" />
              </template>
              Lỗi: {{ error.message }}. Vui lòng kiểm tra lại cấu hình backend.
            </q-banner>
          </div>

          <q-list v-if="filteredHoSo && !loading" bordered separator class="bg-white rounded-borders">
            <q-expansion-item
              v-for="hoso in filteredHoSo"
              :key="hoso.maSoBhxh"
              group="hoso-group"
              icon="person"
              :label="hoso.hoTen"
              :caption="'MSBHXH: ' + hoso.maSoBhxh"
            >
               <template v-slot:header>
                  <q-item-section avatar>
                     <q-avatar icon="person" color="primary" text-color="white" />
                  </q-item-section>

                  <q-item-section>
                     <q-item-label>{{ hoso.hoTen }} {{ hoso.ngaySinh }}</q-item-label>
                     <q-item-label caption>MSBHXH: {{ hoso.maSoBhxh }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                     <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        icon="receipt_long"
                        @click.stop="showHistoryDialog(hoso)"
                        :disable="hoso.lichSuThanhToan.length === 0"
                      >
                        <q-tooltip>Xem Lịch sử Giao dịch</q-tooltip>
                     </q-btn>
                  </q-item-section>
               </template>

              <q-card class="bg-grey-1">
                <q-card-section>
                    <q-list dense>

                      <q-item>
                        <q-item-section avatar><q-icon color="primary" name="credit_card" /></q-item-section>
                        <q-item-section>
                          <q-item-label>Số CMND/CCCD</q-item-label>
                          <q-item-label caption>{{ hoso.cmnd }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.soDienThoai">
                        <q-item-section avatar><q-icon color="primary" name="phone" /></q-item-section>
                        <q-item-section>
                          <q-item-label>Số điện thoại</q-item-label>
                          <q-item-label caption>{{ hoso.soDienThoai }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.email">
                        <q-item-section avatar><q-icon color="primary" name="email" /></q-item-section>
                        <q-item-section>
                          <q-item-label>Email</q-item-label>
                          <q-item-label caption>{{ hoso.email }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar><q-icon color="primary" name="home" /></q-item-section>
                        <q-item-section>
                          <q-item-label>Địa chỉ</q-item-label>
                          <q-item-label caption>{{ hoso.diaChi }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.hoGiaDinh">
                          <q-item-section avatar><q-icon color="primary" name="group" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Hộ gia đình</q-item-label>
                              <q-item-label caption>{{ hoso.hoGiaDinh }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.ngayDk">
                          <q-item-section avatar><q-icon color="primary" name="event" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Ngày đăng ký</q-item-label>
                              <q-item-label caption>{{ hoso.ngayDk }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.tenDonViBhxh">
                          <q-item-section avatar><q-icon color="primary" name="business" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Đơn vị BHXH</q-item-label>
                              <q-item-label caption>{{ hoso.tenDonViBhxh }} ({{ hoso.maDonViBhxh }})</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.phuongAn">
                          <q-item-section avatar><q-icon color="primary" name="rule" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Phương án</q-item-label>
                              <q-item-label caption>{{ hoso.phuongAn }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.mucTienDong">
                          <q-item-section avatar><q-icon color="primary" name="payments" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Mức tiền đóng</q-item-label>
                              <q-item-label caption>{{ formatCurrency(hoso.mucTienDong) }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.phuongThucDong">
                          <q-item-section avatar><q-icon color="primary" name="event_repeat" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Phương thức đóng</q-item-label>
                              <q-item-label caption>{{ hoso.phuongThucDong }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.tuThangNam">
                          <q-item-section avatar><q-icon color="primary" name="date_range" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Đóng từ tháng/năm</q-item-label>
                              <q-item-label caption>{{ hoso.tuThangNam }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.thoiGianNhacDong">
                          <q-item-section avatar><q-icon color="primary" name="alarm" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Thời gian nhắc đóng</q-item-label>
                              <q-item-label caption>{{ hoso.thoiGianNhacDong }}</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.tiLeHoaHong">
                          <q-item-section avatar><q-icon color="primary" name="percent" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Tỉ lệ hoa hồng</q-item-label>
                              <q-item-label caption>{{ hoso.tiLeHoaHong }}%</q-item-label>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="hoso.ghiChu">
                          <q-item-section avatar><q-icon color="primary" name="description" /></q-item-section>
                          <q-item-section>
                              <q-item-label>Ghi chú</q-item-label>
                              <q-item-label caption style="white-space: pre-wrap;">{{ hoso.ghiChu }}</q-item-label>
                          </q-item-section>
                      </q-item>
                    </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>

           <div v-if="filteredHoSo && filteredHoSo.length === 0 && !loading" class="text-center q-my-md">
              <q-banner inline-actions class="text-grey-8 bg-white">
                 <template v-slot:avatar>
                    <q-icon name="info" />
                 </template>
                 Không tìm thấy người tham gia nào phù hợp.
              </q-banner>
           </div>
        </div>
      </div>
    </div>

    <!-- History Dialog -->
    <q-dialog v-model="isHistoryDialogVisible" persistent>
      <q-card style="width: 90vw; max-width: 600px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Lịch sử giao dịch</div>
          <div v-if="selectedHoso" class="text-subtitle2">{{ selectedHoso.hoTen }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 60vh" class="scroll">
          <div v-if="!selectedHoso || selectedHoso.lichSuThanhToan.length === 0" class="text-center q-pa-md text-grey-7">
            <q-icon name="hourglass_empty" size="lg" />
            <div>Không có lịch sử giao dịch.</div>
          </div>
          <q-list separator v-else>
            <q-item v-for="tx in selectedHoso.lichSuThanhToan" :key="tx.id">
              <q-item-section>
                <q-item-label>Ngày lập: {{ tx.ngayLap }}</q-item-label>
                <q-item-label caption>Trạng thái: {{ tx.trangThaiHoSoName }}</q-item-label>
                <q-item-label caption>Nội dung: {{ tx.noiDung }}</q-item-label>
                <q-item-label caption>Người nộp: {{ tx.nguoiNop }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                 <q-item-label class="text-weight-bold text-positive">{{ formatCurrency(tx.tongTien) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
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

export default defineComponent({
  name: 'PageTraCuuHoSo',
  setup() {
    const searchTerm = ref('');
    const isHistoryDialogVisible = ref(false);
    const selectedHoso = ref(null);

    const { result, loading, error } = useQuery(GET_ALL_HOSO);

    const allHoSo = computed(() => (result.value ? result.value.hoSoBHXH : []));

    const filteredHoSo = computed(() => {
      const term = searchTerm.value.toLowerCase().trim();
      if (!term) {
        return allHoSo.value;
      }
      return allHoSo.value.filter(hoso =>
        hoso.maSoBhxh.toLowerCase().includes(term) ||
        hoso.hoTen.toLowerCase().includes(term) ||
        (hoso.cmnd && hoso.cmnd.toLowerCase().includes(term))
      );
    });

    const showHistoryDialog = (hoso) => {
      selectedHoso.value = hoso;
      isHistoryDialogVisible.value = true;
    };

    const formatCurrency = (value) => {
      if (isNaN(value) || value === null) {
        return '';
      }
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return {
      searchTerm,
      loading,
      error,
      filteredHoSo,
      isHistoryDialogVisible,
      selectedHoso,
      showHistoryDialog,
      formatCurrency,
    };
  },
});
</script>

<style lang="scss">
.container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
