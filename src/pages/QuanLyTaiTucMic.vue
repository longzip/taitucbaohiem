<template>
  <q-page class="q-pa-md">
    <!-- THANH TIÊU ĐỀ & NÚT LÀM MỚI -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="groups" size="md" color="primary" class="q-mr-sm" />
        <div>
          <div class="text-h6 text-bold">Quản Lý Tất Cả Khách Hàng MIC</div>
          <div class="text-caption text-grey">Danh sách toàn bộ hợp đồng gốc được lưu trữ trên hệ thống</div>
        </div>
      </div>
       <div>
        <q-btn
          color="primary"
          icon="add_circle"
          label="Tạo HĐ Mới"
          @click="moDialogThemMoi"
          class="q-mr-sm"
        >
          <q-tooltip>Tạo hợp đồng MIC mới từ một mã số BHXH</q-tooltip>
        </q-btn>
        <q-btn
          round
          flat
          color="primary"
          icon="refresh"
          @click="refetch()"
          :loading="loading"
        >
          <q-tooltip>Tải lại toàn bộ từ Database</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- THANH TÌM KIẾM & COMBOBOX LỌC TRẠNG THÁI -->
    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-8">
          <q-input
            v-model="tuKhoaTimKiem"
            outlined
            dense
            placeholder="Gõ để tìm kiếm và bấm Enter hoặc icon..."
            @keyup.enter="refetch()"
            clearable
            @clear="xoaTimKiem"
          >
            <template v-slot:append>
              <q-icon name="search" @click="refetch()" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <q-select
            v-model="trangThaiChon"
            :options="danhSachTrangThai"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            outlined
            dense
            label="Lọc theo trạng thái đơn"
          >
            <template v-slot:prepend>
              <q-icon name="filter_alt" />
            </template>
          </q-select>
        </div>
      </q-card-section>

      <!-- Khớp bộ lọc -->
      <q-card-section v-if="tuKhoaTimKiem || trangThaiChon !== 'ALL'" class="bg-grey-2 row items-center justify-between text-caption q-px-md">
        <div>
          Đang áp dụng bộ lọc kết hợp:
          <strong v-if="tuKhoaTimKiem">Từ khóa "{{ tuKhoaTimKiem }}" </strong>
          <strong v-if="trangThaiChon !== 'ALL'">+ Trạng thái: {{ layTenTrangThai(trangThaiChon) }}</strong>
        </div>
        <q-badge color="primary">Khớp: {{ danhSachHienThi.length }} dòng</q-badge>
      </q-card-section>
    </q-card>

    <!-- TRẠNG THÁI LOADING -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- TRẠNG THÁI DANH SÁCH TRỐNG -->
    <div v-else-if="danhSachHienThi.length === 0" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="person_search" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không tìm thấy khách hàng nào phù hợp với bộ lọc</div>
    </div>

    <!-- LƯỚI HIỂN THỊ DANH SÁCH KHÁCH HÀNG (GRID CARDS) -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="contract in danhSachHienThi"
        :key="contract.idHopDong"
        class="col-12 col-md-6 col-lg-4"
      >
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
               <q-btn
                size="sm"
                color="secondary"
                icon="history"
                dense
                class="q-px-sm"
                @click="moDialogXemLichSu(contract)"
              >
                <q-tooltip>Xem lịch sử ghi nhận thanh toán</q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                color="positive"
                icon="note_add"
                label="Ghi nhận"
                dense
                class="q-px-sm"
                @click="moDialogThemLichSu(contract)"
              />
              <q-btn
                v-if="contract.trangThaiDon === 'Da thu tien' && contract.lichSuChuaDuyet"
                dense
                flat
                size="md"
                class="q-px-sm text-white"
                :style="{ backgroundColor: layMauTrangThaiDon(contract.trangThaiDon, contract.soNgayConLai) }"
                @click="moDialogCapNhatLichSu(contract)"
              >
                Chờ biên lai ({{ contract.lichSuChuaDuyet.tiLeHoaHong }}% HH)
                <q-tooltip>Bấm để cập nhật thông tin biên lai</q-tooltip>
              </q-btn>
              <q-badge v-else :color="layMauTrangThaiDon(contract.trangThaiDon, contract.soNgayConLai)">
                {{ bieuDienTrangThai(contract.trangThaiDon, contract.soNgayConLai) }}
              </q-badge>
            </div>
          </q-card-section>

          <!-- CARD BODY -->
          <q-card-section class="q-pa-md q-gutter-y-sm" style="font-size: 13px;">
            <div class="text-caption text-uppercase text-grey-7 q-mb-xs">Người được bảo hiểm</div>

            <div class="row"><span class="col-4 text-grey-8">Số HĐ MIC:</span><span class="col-8 text-bold text-primary">{{ contract.soHopDongMic || 'Chưa có' }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">Ngày sinh:</span><span class="col-8 text-bold">{{ dinhDangNgay(contract.ndbhNgaySinh) }}</span></div>
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
                    <div class="text-weight-bold">{{ dinhDangNgay(contract.ngayBatDau) }}</div>
                </div>
                <div class="col">
                    <div class="text-caption text-grey-8">Đến ngày</div>
                    <div class="text-weight-bold text-negative">{{ dinhDangNgay(contract.ngayHetHan) }}</div>
                </div>
                <div class="col">
                    <div class="text-caption text-grey-8">Phí BH</div>
                    <div class="text-weight-bold text-negative">{{ dinhDangTien(contract.mucPhi) }}</div>
                </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- HỘP THOẠI THÊM/CẬP NHẬT LỊCH SỬ -->
    <q-dialog v-model="dialogThemLichSu" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section class="bg-primary text-white row items-center">
          <q-icon name="note_add" size="sm" class="q-mr-sm" />
          <div class="text-subtitle1 text-bold">{{ formLichSu.idLog ? 'Cập nhật' : 'Thêm' }} Lịch Sử Ghi Nhận</div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
           <div class="text-body2">
            Khách hàng: <strong class="text-primary">{{ formLichSu.tenKhachHang }}</strong>
          </div>
          <div class="text-caption text-negative text-italic">
            * Hệ thống sẽ ghi nhận lịch sử tính hoa hồng ngay. Số hóa đơn và mã tra cứu có thể bổ sung sau.
          </div>
          <q-input
            v-model="formLichSu.soHoaDon"
            outlined
            dense
            label="Số Hóa Đơn (Tùy chọn)"
          />
          <q-input
            v-model="formLichSu.maTraCuu"
            outlined
            dense
            label="Mã Tra Cứu / QR Code (Tùy chọn)"
          />
          <q-input
            v-model.number="formLichSu.tiLeHoaHong"
            type="number"
            outlined
            dense
            label="Tỉ lệ hoa hồng (%)"
            :rules="[val => val >= 0 && val <= 100 || 'Tỉ lệ từ 0 - 100']"
          />
          <q-select
            v-model="formLichSu.phuongThuc"
            :options="['Chuyen khoan', 'Tien mat', 'Vi dien tu']"
            outlined
            dense
            label="Phương thức thanh toán"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn v-if="formLichSu.idLog" flat label="Hủy Thu" color="negative" @click="xuLyHuyThu" />
          <q-space v-if="formLichSu.idLog" />
          <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
          <q-btn
            unevaluated
            :label="formLichSu.idLog ? 'Cập Nhật' : 'Ghi Nhận'"
            color="primary"
            @click="xuLyThemLichSu"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- HỘP THOẠI TẠO HỢP ĐỒNG MỚI -->
    <q-dialog v-model="dialogThemMoi" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section class="bg-primary text-white row items-center">
          <q-icon name="add_circle" size="sm" class="q-mr-sm" />
          <div class="text-subtitle1 text-bold">Tạo Hợp Đồng MIC từ BHYT</div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
           <div class="text-caption text-grey-8">
            Nhập Mã số BHXH của khách hàng đã có trong danh bạ BHYT để tạo hợp đồng MIC mới.
          </div>
          <q-input
            v-model="maSoBhxhMoi"
            outlined
            dense
            label="Mã số BHXH"
            autofocus
            @keyup.enter="xuLyThemMoiHopDong"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
          <q-btn
            unevaluated
            label="Tạo Hợp Đồng"
            color="primary"
            @click="xuLyThemMoiHopDong"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- HỘP THOẠI XEM LỊCH SỬ -->
    <q-dialog v-model="dialogXemLichSu">
      <q-card style="min-width: 500px;">
        <q-card-section class="bg-secondary text-white row items-center">
          <q-icon name="history" size="sm" class="q-mr-sm" />
          <div class="text-subtitle1 text-bold">Lịch Sử Ghi Nhận</div>
        </q-card-section>

        <q-card-section v-if="lichSuDangXem">
          <div class="text-subtitle2 q-mb-md">
            Khách hàng: <strong class="text-primary">{{ lichSuDangXem.ndbhHoTen }}</strong>
          </div>
          <q-list bordered separator dense>
            <q-item
              v-for="log in lichSuDangXem.lichSuThanhToan"
              :key="log.idLog"
              class="q-py-sm"
            >
              <q-item-section>
                <q-item-label class="text-bold">{{ dinhDangNgayGio(log.ngayThu) }} - {{ log.nhanVienThu }}</q-item-label>
                <q-item-label caption>
                  Trạng thái: <strong>{{ log.trangThaiNopTien }}</strong> | Phí: {{ dinhDangTien(log.soTienGoc) }}
                </q-item-label>
                <q-item-label caption v-if="log.tienHoaHongTichLuy > 0">
                  Hoa hồng: <strong class="text-positive">{{ dinhDangTien(log.tienHoaHongTichLuy) }}</strong>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="!lichSuDangXem.lichSuThanhToan || lichSuDangXem.lichSuThanhToan.length === 0" class="text-center text-grey q-pa-md">
            Chưa có lịch sử ghi nhận nào.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const $q = useQuasar()

// STATES DỮ LIỆU
const tuKhoaTimKiem = ref('')
const trangThaiChon = ref('ALL')

// STATE HỘP THOẠI THÊM/CẬP NHẬT LỊCH SỬ
const dialogThemLichSu = ref(false)
const formLichSu = ref({
  idHopDong: null,
  idLog: null,
  tenKhachHang: '',
  soHoaDon: '',
  maTraCuu: '',
  phuongThuc: 'Chuyen khoan',
  tiLeHoaHong: 20
})

// STATE HỘP THOẠI TẠO MỚI
const dialogThemMoi = ref(false)
const maSoBhxhMoi = ref('')

// STATE HỘP THOẠI XEM LỊCH SỬ
const dialogXemLichSu = ref(false)
const lichSuDangXem = ref(null)


const danhSachTrangThai = [
  { label: 'Tất cả trạng thái', value: 'ALL' },
  { label: 'Hiệu lực thường', value: 'HIEU_LUC' },
  { label: 'Sắp hết hạn (<= 30 ngày)', value: 'SAP_HET_HAN' },
  { label: 'Đã hết hạn (< 0 ngày)', value: 'DA_HET_HAN' },
  { label: 'Chờ biên lai (Đã thu tiền)', value: 'CHO_DUYET' }
]

// QUERIES & MUTATIONS GRAPHQL
const QUERY_TAT_CA_KH = gql`
  query GetDanhSachTatCa($searchKeyword: String) {
    danhSachTatCaMicDon(searchKeyword: $searchKeyword) {
      idHopDong soHopDongMic ngayBatDau ngayHetHan mucPhi trangThaiDon
      ndbhHoTen ndbhNgaySinh ndbhCccd ndbhBhxh ndbhGioiTinh ndbhDiaChi ndbhSdt ndbhEmail
      nmbhHoTen nmbhDiaChi nmbhSdt soNgayConLai
      lichSuChuaDuyet {
        idLog
        soHoaDon
        maTraCuu
        phuongThuc
        tiLeHoaHong
      }
      lichSuThanhToan {
          idLog
          ngayThu
          soTienGoc
          tienHoaHongTichLuy
          nhanVienThu
          trangThaiNopTien
      }
    }
  }
`

const MUTATION_THU_TIEN = gql`
  mutation ThuTien($idHopDong: Int!, $idLog: Int, $soHoaDon: String, $maTraCuu: String, $phuongThuc: String, $tiLeHoaHong: Float) {
    thuTienMic(input: {
      idHopDong: $idHopDong,
      idLog: $idLog,
      soHoaDon: $soHoaDon,
      maTraCuu: $maTraCuu,
      phuongThuc: $phuongThuc,
      tiLeHoaHong: $tiLeHoaHong
    }) {
      success
      message
    }
  }
`

const MUTATION_HUY_THU = gql`
  mutation HuyThu($idLog: Int!) {
    huyThuMic(input: { idLog: $idLog }) {
      success
      message
    }
  }
`

const MUTATION_TAO_HOP_DONG_TU_BHYT = gql`
  mutation TaoHopDongMicTuBhyt($maSoBhxh: String!) {
    taoHopDongMicTuBhyt(input: { maSoBhxh: $maSoBhxh }) {
      success
      message
    }
  }
`

// Apollo Composables
const { result, loading, error, refetch } = useQuery(QUERY_TAT_CA_KH, () => ({ 
  searchKeyword: tuKhoaTimKiem.value ? tuKhoaTimKiem.value.trim() : null
}), () => ({ 
  fetchPolicy: 'network-only'
}));

const { mutate: thuTien, onDone: onThuTienDone, onError: onThuTienError } = useMutation(MUTATION_THU_TIEN)
const { mutate: huyThu, onDone: onHuyThuDone, onError: onHuyThuError } = useMutation(MUTATION_HUY_THU)
const { mutate: taoHopDong, onDone: onTaoHopDongDone, onError: onTaoHopDongError } = useMutation(MUTATION_TAO_HOP_DONG_TU_BHYT)

const danhSachGoc = computed(() => result.value?.danhSachTatCaMicDon ?? []);

watch(error, (newError) => {
  if (newError) {
    $q.notify({ type: 'negative', message: 'Lỗi khi tải dữ liệu. Vui lòng thử lại.' });
  }
});

onThuTienDone(({ data }) => {
  if (data.thuTienMic?.success) {
    $q.notify({ type: 'positive', message: data.thuTienMic.message || 'Đã ghi nhận lịch sử thành công!' });
    dialogThemLichSu.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.thuTienMic?.message || 'Có lỗi xảy ra.' });
  }
  $q.loading.hide();
});

onThuTienError((error) => {
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
  $q.loading.hide();
});

onHuyThuDone(({ data }) => {
  if (data.huyThuMic?.success) {
    $q.notify({ type: 'positive', message: 'Đã hủy thu thành công!' });
    dialogThemLichSu.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.huyThuMic?.message || 'Có lỗi xảy ra khi hủy thu.' });
  }
  $q.loading.hide();
});

onHuyThuError((error) => {
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
  $q.loading.hide();
});

onTaoHopDongDone(({ data }) => {
  if (data.taoHopDongMicTuBhyt?.success) {
    $q.notify({ type: 'positive', message: data.taoHopDongMicTuBhyt.message || 'Tạo hợp đồng thành công!' });
    dialogThemMoi.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.taoHopDongMicTuBhyt?.message || 'Có lỗi xảy ra khi tạo hợp đồng.' });
  }
  $q.loading.hide();
});

onTaoHopDongError((error) => {
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
  $q.loading.hide();
});

const moDialogXemLichSu = (contract) => {
  lichSuDangXem.value = contract
  dialogXemLichSu.value = true
}

const moDialogThemMoi = () => {
  maSoBhxhMoi.value = '';
  dialogThemMoi.value = true;
};

const xuLyThemMoiHopDong = () => {
  if (!maSoBhxhMoi.value || maSoBhxhMoi.value.trim() === '') {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập Mã số BHXH.' });
    return;
  }

  $q.loading.show({ message: 'Đang tạo hợp đồng...' });
  taoHopDong({ maSoBhxh: maSoBhxhMoi.value.trim() });
};

const moDialogThemLichSu = (contract) => {
  formLichSu.value = {
    idHopDong: contract.idHopDong,
    idLog: null,
    tenKhachHang: contract.ndbhHoTen,
    soHoaDon: '',
    maTraCuu: '',
    phuongThuc: 'Chuyen khoan',
    tiLeHoaHong: 20
  }
  dialogThemLichSu.value = true
}

const moDialogCapNhatLichSu = (contract) => {
  const lichSu = contract.lichSuChuaDuyet;
  if (!lichSu) return;

  formLichSu.value = {
    idHopDong: contract.idHopDong,
    idLog: lichSu.idLog,
    tenKhachHang: contract.ndbhHoTen,
    soHoaDon: lichSu.soHoaDon || '',
    maTraCuu: lichSu.maTraCuu || '',
    phuongThuc: lichSu.phuongThuc || 'Chuyen khoan',
    tiLeHoaHong: lichSu.tiLeHoaHong || 20
  }
  dialogThemLichSu.value = true
}

const xuLyThemLichSu = () => {
  const f = formLichSu.value

  $q.loading.show({ message: 'Đang lưu lịch sử...' })
  thuTien({
    idHopDong: parseInt(f.idHopDong),
    idLog: f.idLog ? parseInt(f.idLog) : null,
    soHoaDon: f.soHoaDon ? f.soHoaDon.trim() : "",
    maTraCuu: f.maTraCuu ? f.maTraCuu.trim() : "",
    phuongThuc: f.phuongThuc,
    tiLeHoaHong: parseFloat(f.tiLeHoaHong)
  });
}

const xuLyHuyThu = () => {
  const idLog = formLichSu.value.idLog;
  if (!idLog) return;

  $q.dialog({
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn muốn hủy ghi nhận thu tiền này không? Hành động này sẽ xóa lịch sử và đưa hợp đồng về trạng thái "Cần tái tục".',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.loading.show({ message: 'Đang hủy thu...' });
    huyThu({ idLog: parseInt(idLog) });
  });
}


const danhSachHienThi = computed(() => {
  let ketQua = danhSachGoc.value
  if (trangThaiChon.value !== 'ALL') {
    ketQua = ketQua.filter(item => {
      const status = item.trangThaiDon
      const days = item.soNgayConLai

      switch (trangThaiChon.value) {
        case 'CHO_DUYET':
          // "Chờ biên lai" là các hợp đồng đã thu tiền.
          return status === 'Da thu tien';

        case 'DA_HET_HAN':
          // "Đã hết hạn" là các hợp đồng có số ngày còn lại < 0 và chưa được thu tiền.
          return days < 0 && status !== 'Da thu tien';

        case 'SAP_HET_HAN':
          // "Sắp hết hạn" là các hợp đồng còn 0-30 ngày và chưa được thu tiền.
          return days >= 0 && days <= 30 && status !== 'Da thu tien';

        case 'HIEU_LUC':
          // "Hiệu lực" là các hợp đồng còn trên 30 ngày và chưa được thu tiền.
          return days > 30 && status !== 'Da thu tien';

        default:
          return true;
      }
    })
  }
  return ketQua
})

const xoaTimKiem = () => { tuKhoaTimKiem.value = ''; refetch(); }
const layTenTrangThai = (val) => danhSachTrangThai.find(t => t.value === val)?.label || ''
const dinhDangNgay = (d) => { if(!d) return 'N/A'; const [y,m,df] = d.split('-'); return `${df}/${m}/${y}`; }
const dinhDangTien = (val) => val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : '0 đ'

const dinhDangNgayGio = (d) => {
  if (!d) return 'N/A';
  const date = new Date(d);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const bieuDienTrangThai = (status, soNgay) => {
  if (status === 'Da thu tien') return 'Chờ biên lai'
  if (soNgay < 0) return 'Đã hết hạn'
  if (soNgay <= 30) return `Sắp hết hạn (${soNgay} ngày)`
  return 'Hiệu lực'
}

const layMauTrangThaiDon = (status, soNgay) => {
  if (status === 'Da thu tien') return 'orange'
  if (soNgay < 0) return 'negative'
  if (soNgay <= 30) return 'warning'
  return 'positive'
}
</script>
