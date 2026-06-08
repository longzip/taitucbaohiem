<template>
  <q-page class="q-pa-md">
    <!-- THANH TIÊU ĐỀ & NÚT LÀM MỚI -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="groups" size="md" color="primary" class="q-mr-sm" />
        <div>
          <div class="text-h6 text-bold">Quản Lý BHXH Tự Nguyện</div>
          <div class="text-caption text-grey">Danh sách người tham gia BHXH tự nguyện</div>
        </div>
      </div>
       <div>
        <q-btn
          color="primary"
          icon="add_circle"
          label="Thêm Người Mới"
          @click="moDialogThemMoi"
          class="q-mr-sm"
        >
          <q-tooltip>Thêm một người tham gia BHXH mới</q-tooltip>
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
            label="Lọc theo trạng thái"
          >
            <template v-slot:prepend>
              <q-icon name="filter_alt" />
            </template>
          </q-select>
        </div>
      </q-card-section>
    </q-card>

    <!-- TRẠNG THÁI LOADING -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- TRẠNG THÁI DANH SÁCH TRỐNG -->
    <div v-else-if="danhSachHienThi.length === 0" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="person_search" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không tìm thấy người tham gia nào phù hợp</div>
    </div>

    <!-- LƯỚI HIỂN THỊ DANH SÁCH -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="nguoiThamGia in danhSachHienThi"
        :key="nguoiThamGia.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card>
          <!-- CARD HEADER -->
          <q-card-section class="bg-grey-3 row items-center justify-between">
            <div class="row items-center">
              <q-avatar size="28px" color="primary" text-color="white" icon="person" class="q-mr-xs" />
              <div class="text-subtitle2 text-bold text-uppercase">
                {{ nguoiThamGia.hoTen }}
              </div>
            </div>
            <div class="row items-center q-gutter-x-xs">
               <q-btn
                size="sm"
                color="secondary"
                icon="history"
                dense
                class="q-px-sm"
                @click="moDialogXemLichSu(nguoiThamGia)"
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
                @click="moDialogThemLichSu(nguoiThamGia)"
              />
            </div>
          </q-card-section>

          <!-- CARD BODY -->
          <q-card-section class="q-pa-md q-gutter-y-sm" style="font-size: 13px;">
            <div class="row"><span class="col-4 text-grey-8">Mã số BHXH:</span><span class="col-8 text-bold text-primary">{{ nguoiThamGia.maSoBhxh }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">Ngày sinh:</span><span class="col-8 text-bold">{{ dinhDangNgay(nguoiThamGia.ngaySinh) }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">CCCD:</span><span class="col-8 text-bold">{{ nguoiThamGia.cccd }}</span></div>
            <div class="row"><span class="col-4 text-grey-8">Điện thoại:</span><span class="col-8"><a :href="`tel:${nguoiThamGia.sdt}`">{{ nguoiThamGia.sdt || 'N/A' }}</a></span></div>
            <div class="row"><span class="col-4 text-grey-8">Địa chỉ:</span><span class="col-8 text-caption">{{ nguoiThamGia.diaChi || 'N/A' }}</span></div>

            <q-separator class="q-my-md" />

            <!-- THÔNG TIN ĐÓNG BHXH -->
            <div class="row justify-between items-center text-center">
                <div class="col">
                    <div class="text-caption text-grey-8">P.thức đóng</div>
                    <div class="text-weight-bold">{{ nguoiThamGia.phuongThucDong }}</div>
                </div>
                <div class="col">
                    <div class="text-caption text-grey-8">Số tháng</div>
                    <div class="text-weight-bold text-negative">{{ nguoiThamGia.soThangDong }}</div>
                </div>
                <div class="col">
                    <div class="text-caption text-grey-8">Số tiền</div>
                    <div class="text-weight-bold text-negative">{{ dinhDangTien(nguoiThamGia.soTien) }}</div>
                </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- HỘP THOẠI GHI NHẬN ĐÓNG TIỀN -->
    <q-dialog v-model="dialogThemLichSu" persistent>
      <q-card style="min-width: 350px;">
        <q-card-section class="bg-primary text-white row items-center">
          <q-icon name="note_add" size="sm" class="q-mr-sm" />
          <div class="text-subtitle1 text-bold">Ghi Nhận Đóng Tiền BHXH</div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
           <div class="text-body2">
            Người tham gia: <strong class="text-primary">{{ formLichSu.tenNguoiThamGia }}</strong>
          </div>
          <q-input
            v-model.number="formLichSu.soThang"
            type="number"
            outlined
            dense
            label="Số tháng đóng"
            :rules="[val => val > 0 || 'Số tháng phải lớn hơn 0']"
          />
          <q-input
            v-model.number="formLichSu.soTien"
            type="number"
            outlined
            dense
            label="Số tiền đóng"
            :rules="[val => val > 0 || 'Số tiền phải lớn hơn 0']"
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
          <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
          <q-btn
            unevaluated
            label="Ghi Nhận"
            color="primary"
            @click="xuLyThemLichSu"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- HỘP THOẠI THÊM NGƯỜI THAM GIA MỚI -->
    <q-dialog v-model="dialogThemMoi" persistent>
      <q-card style="min-width: 450px;">
        <q-card-section class="bg-primary text-white row items-center">
          <q-icon name="add_circle" size="sm" class="q-mr-sm" />
          <div class="text-subtitle1 text-bold">Thêm Người Tham Gia BHXH Mới</div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
          <q-input v-model="formNguoiMoi.hoTen" outlined dense label="Họ và tên" />
          <q-input v-model="formNguoiMoi.maSoBhxh" outlined dense label="Mã số BHXH" />
          <q-input v-model="formNguoiMoi.ngaySinh" outlined dense label="Ngày sinh (YYYY-MM-DD)" />
          <q-input v-model="formNguoiMoi.cccd" outlined dense label="Số CCCD" />
          <q-input v-model="formNguoiMoi.sdt" outlined dense label="Số điện thoại" />
          <q-input v-model="formNguoiMoi.diaChi" outlined dense label="Địa chỉ" />
          <q-select v-model="formNguoiMoi.phuongThucDong" :options="['1 tháng', '3 tháng', '6 tháng', '12 tháng']" outlined dense label="Phương thức đóng" />
          <q-input v-model.number="formNguoiMoi.soTien" type="number" outlined dense label="Số tiền mỗi lần đóng" />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Hủy bỏ" color="grey" v-close-popup />
          <q-btn
            unevaluated
            label="Thêm Mới"
            color="primary"
            @click="xuLyThemMoiNguoiThamGia"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const $q = useQuasar()

// STATES DỮ LIỆU
const tuKhoaTimKiem = ref('')
const trangThaiChon = ref('ALL')
const dialogThemLichSu = ref(false)
const dialogThemMoi = ref(false)

const formLichSu = ref({})
const formNguoiMoi = ref({})

const danhSachTrangThai = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Đang tham gia', value: 'DANG_THAM_GIA' },
  { label: 'Tạm dừng', value: 'TAM_DUNG' },
]

// GRAPHQL
const QUERY_DANH_SACH_BHXH = gql`
  query GetDanhSachBhxh($searchKeyword: String) {
    danhSachBhxh(searchKeyword: $searchKeyword) {
      id
      hoTen
      maSoBhxh
      ngaySinh
      cccd
      sdt
      diaChi
      phuongThucDong
      soThangDong
      soTien
      trangThai
    }
  }
`

const MUTATION_THEM_LICH_SU = gql`
  mutation ThemDongBhxh($input: ThemDongBhxhInput!) {
    themDongBhxh(input: $input) {
      success
      message
    }
  }
`
const MUTATION_THEM_NGUOI_MOI = gql`
  mutation ThemNguoiThamGiaBhxh($input: ThemNguoiThamGiaBhxhInput!) {
    themNguoiThamGiaBhxh(input: $input) {
      success
      message
    }
  }
`

const { result, loading, error, refetch } = useQuery(QUERY_DANH_SACH_BHXH, () => ({
  searchKeyword: tuKhoaTimKiem.value ? tuKhoaTimKiem.value.trim() : null
}), { fetchPolicy: 'network-only' });

const { mutate: themLichSuDong, onDone: onThemLichSuDone } = useMutation(MUTATION_THEM_LICH_SU)
const { mutate: themNguoiMoi, onDone: onThemNguoiMoiDone } = useMutation(MUTATION_THEM_NGUOI_MOI)

const danhSachGoc = computed(() => result.value?.danhSachBhxh ?? []);

const danhSachHienThi = computed(() => {
  if (trangThaiChon.value === 'ALL') {
    return danhSachGoc.value;
  }
  return danhSachGoc.value.filter(item => item.trangThai === trangThaiChon.value);
})

onThemLichSuDone(({ data }) => {
  const result = data.themDongBhxh;
  if (result?.success) {
    $q.notify({ type: 'positive', message: result.message || 'Ghi nhận thành công!' });
    dialogThemLichSu.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: result?.message || 'Có lỗi xảy ra.' });
  }
  $q.loading.hide();
});

onThemNguoiMoiDone(({ data }) => {
  const result = data.themNguoiThamGiaBhxh;
  if (result?.success) {
    $q.notify({ type: 'positive', message: result.message || 'Thêm người tham gia thành công!' });
    dialogThemMoi.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: result?.message || 'Có lỗi xảy ra.' });
  }
  $q.loading.hide();
});

const moDialogThemLichSu = (nguoiThamGia) => {
  formLichSu.value = {
    idNguoiThamGia: nguoiThamGia.id,
    tenNguoiThamGia: nguoiThamGia.hoTen,
    soThang: nguoiThamGia.soThangDong,
    soTien: nguoiThamGia.soTien,
    phuongThuc: 'Chuyen khoan'
  }
  dialogThemLichSu.value = true
}

const xuLyThemLichSu = () => {
  $q.loading.show({ message: 'Đang ghi nhận...' })
  themLichSuDong({ input: formLichSu.value });
}

const moDialogThemMoi = () => {
  formNguoiMoi.value = {
    phuongThucDong: '3 tháng'
  };
  dialogThemMoi.value = true;
};

const xuLyThemMoiNguoiThamGia = () => {
  $q.loading.show({ message: 'Đang thêm người tham gia...' });
  themNguoiMoi({ input: formNguoiMoi.value });
};

const xoaTimKiem = () => { tuKhoaTimKiem.value = ''; refetch(); }
const dinhDangNgay = (d) => { if(!d) return 'N/A'; const [y,m,df] = d.split('-'); return `${df}/${m}/${y}`; }
const dinhDangTien = (val) => val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : '0 đ'

</script>
