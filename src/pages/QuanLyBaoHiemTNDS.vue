<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- 1. BỘ PHẦN HEADER TRANG -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-primary">Quản lý bảo hiểm TNDS</div>
        <div class="text-caption text-grey-7">Quản lý và theo dõi danh sách hợp đồng bảo hiểm bắt buộc TNDS</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          outline
          label="Tải lại"
          color="grey-8"
          icon="refresh"
          :loading="loading"
          @click="refetch"
        />
        <q-btn
          label="Thêm mới hợp đồng"
          color="primary"
          icon="add"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- 2. BỘ PHẦN LỌC VÀ TÌM KIẾM -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-8">
        <q-input
          v-model="searchKeyword"
          placeholder="Tìm kiếm theo tên chủ xe hoặc biển số xe..."
          outlined
          dense
          bg-color="white"
          clearable
          @clear="clearSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          outlined
          dense
          bg-color="white"
          label="Trạng thái hết hạn"
        />
      </div>
    </div>

    <!-- 3. DANH SÁCH DẠNG THẺ (CARD ITEMS GRID) -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="filteredList.length === 0" class="row justify-center q-my-xl">
      <div class="text-center q-pa-xl bg-white rounded-borders shadow-1 border-dashed col-12 col-sm-8 col-md-6">
        <q-icon name="assignment_late" size="xl" color="grey-5" />
        <div class="q-mt-sm text-subtitle1 text-grey-7">Không tìm thấy hợp đồng bảo hiểm nào phù hợp</div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="contract-card shadow-1 bg-white hover-shadow">
          <!-- Phần đầu thẻ: Tên và trạng thái hiệu lực -->
          <q-card-section class="q-pb-none">
            <div class="row items-start justify-between no-wrap">
              <div class="ellipsis">
                <div class="text-subtitle1 text-weight-bold text-primary ellipsis">{{ item.chuXeHoTen }}</div>
                <div class="text-caption text-grey-6 ellipsis" v-if="item.user">
                  <q-icon name="person" size="14px" class="q-mr-xs" />Nhân viên: {{ item.user.name }}
                </div>
              </div>

              <!-- Huy hiệu trạng thái hết hạn -->
              <div>
                <q-chip
                  v-if="item.soNgayConLai < 0"
                  color="red-1"
                  text-color="negative"
                  dense
                  size="sm"
                  icon="error"
                  class="text-weight-bold"
                >
                  Hết hạn
                </q-chip>
                <q-chip
                  v-else-if="item.soNgayConLai <= 30"
                  color="warning"
                  text-color="black"
                  dense
                  size="sm"
                  icon="warning"
                  class="text-weight-bold"
                >
                  Sắp hết hạn
                </q-chip>
                <q-chip
                  v-else
                  color="green-1"
                  text-color="positive"
                  dense
                  size="sm"
                  icon="check_circle"
                  class="text-weight-bold"
                >
                  Còn hạn
                </q-chip>
              </div>
            </div>
            <q-separator class="q-mt-sm" />
          </q-card-section>

          <!-- Phần nội dung chính của thẻ -->
          <q-card-section class="q-py-sm">
            <div class="row items-center q-mb-xs">
              <div class="col-4 text-grey-7 text-caption">Biển số xe:</div>
              <div class="col-8">
                <!-- Mô phỏng khung biển số xe thật -->
                <div class="license-plate-style text-weight-bold text-center">
                  {{ item.bienSoXe }}
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-xs q-mb-xs">
              <div class="col-4 text-grey-7 text-caption">Phương tiện:</div>
              <div class="col-8 text-weight-medium text-caption ellipsis">
                {{ item.loaiXe || '—' }} <span v-if="item.hangXe">({{ item.hangXe }})</span>
              </div>
            </div>

            <div class="row q-col-gutter-xs q-mb-xs">
              <div class="col-4 text-grey-7 text-caption">Số điện thoại:</div>
              <div class="col-8 text-weight-medium text-caption">
                {{ item.soDienThoai || 'Chưa cung cấp' }}
              </div>
            </div>

            <div class="row q-col-gutter-xs q-mb-xs">
              <div class="col-4 text-grey-7 text-caption">Thời gian:</div>
              <div class="col-8 text-caption text-weight-medium text-grey-9">
                {{ formatDate(item.ngayBatDau) }} → <span class="text-negative text-weight-bold">{{ formatDate(item.ngayHetHan) }}</span>
              </div>
            </div>

            <div class="row q-col-gutter-xs q-mb-xs">
              <div class="col-4 text-grey-7 text-caption">Hạn còn lại:</div>
              <div class="col-8 text-caption text-weight-bold">
                <span v-if="item.soNgayConLai < 0" class="text-negative">Trễ {{ Math.abs(item.soNgayConLai) }} ngày</span>
                <span v-else-if="item.soNgayConLai <= 30" class="text-warning">Còn {{ item.soNgayConLai }} ngày</span>
                <span v-else class="text-positive">Còn {{ item.soNgayConLai }} ngày</span>
              </div>
            </div>

            <div class="row q-col-gutter-xs q-mb-xs items-center">
              <div class="col-4 text-grey-7 text-caption">Phí bảo hiểm:</div>
              <div class="col-8 text-subtitle2 text-weight-bold text-primary">
                {{ formatCurrency(item.phiBaoHiem) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Phần thao tác chỉnh sửa / xóa -->
          <q-card-actions align="right" class="q-py-xs bg-grey-1">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              @click="openEditDialog(item)"
            >
              <q-tooltip>Chỉnh sửa hợp đồng</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="confirmDelete(item)"
            >
              <q-tooltip>Xóa hợp đồng</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- 4. HỘP THOẠI THÊM / SỬA HỢP ĐỒNG (Q-DIALOG) -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 850px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6 text-weight-bold">
            {{ isEditMode ? 'Cập nhật thông tin hợp đồng TNDS' : 'Thêm mới hợp đồng TNDS' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
          <q-form ref="formRef" @submit.prevent="save">

            <!-- Phần 1: Thông tin chủ xe -->
            <div class="text-subtitle2 text-primary q-mb-sm text-weight-bold">
              I. THÔNG TIN CHỦ XE & LIÊN HỆ
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.chuXeHoTen"
                  label="Tên chủ xe *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Vui lòng nhập họ tên chủ xe']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.soDienThoai"
                  label="Số điện thoại"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.userId"
                  label="Mã nhân viên phụ trách"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.diaChi"
                  label="Địa chỉ chủ xe"
                  outlined
                  dense
                  type="textarea"
                  rows="2"
                />
              </div>
            </div>

            <!-- Phần 2: Thông tin phương tiện -->
            <div class="text-subtitle2 text-primary q-mb-sm text-weight-bold">
              II. THÔNG TIN PHƯƠNG TIỆN ĐĂNG KÝ
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.bienSoXe"
                  label="Biển số xe *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Vui lòng nhập biển số xe']"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  v-model="form.loaiXe"
                  :options="['Ô tô', 'Xe máy', 'Khác']"
                  label="Loại xe"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.hangXe"
                  label="Hãng xe"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.phienBan"
                  label="Phiên bản (Model)"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.soKhung"
                  label="Số khung"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.soMay"
                  label="Số máy"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.namSanXuat"
                  label="Năm sản xuất"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.soCho"
                  label="Số chỗ ngồi"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.trongTai"
                  label="Trọng tải (Tấn)"
                  type="number"
                  step="0.1"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.mucDichSuDung"
                  label="Mục đích sử dụng"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.ngayDangKy"
                  label="Ngày đăng ký"
                  type="date"
                  stack-label
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Phần 3: Chi tiết hợp đồng -->
            <div class="text-subtitle2 text-primary q-mb-sm text-weight-bold">
              III. CHI TIẾT HỢP ĐỒNG BẢO HIỂM
            </div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.soGcn"
                  label="Số giấy chứng nhận (GCN)"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.ngayBatDau"
                  label="Ngày bắt đầu *"
                  type="date"
                  stack-label
                  outlined
                  dense
                  :rules="[val => !!val || 'Chọn ngày bắt đầu có hiệu lực']"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="form.ngayHetHan"
                  label="Ngày hết hạn *"
                  type="date"
                  stack-label
                  outlined
                  dense
                  :rules="[val => !!val || 'Chọn ngày hết hạn bảo hiểm']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.phiBaoHiem"
                  label="Phí bảo hiểm *"
                  type="number"
                  outlined
                  dense
                  :rules="[
                    val => !!val || 'Nhập tổng phí bảo hiểm',
                    val => parseFloat(val) > 0 || 'Phí bảo hiểm phải lớn hơn 0'
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="form.trangThai"
                  :options="['Hiệu lực', 'Chờ duyệt', 'Hủy', 'Cần tái tục']"
                  label="Trạng thái"
                  outlined
                  dense
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.ghiChu"
                  label="Ghi chú thêm"
                  outlined
                  dense
                  type="textarea"
                  rows="2"
                />
              </div>
            </div>

            <!-- Phần 4: Người mua bảo hiểm (NMBH) nếu có -->
            <div class="text-subtitle2 text-primary q-mb-sm text-weight-bold">
              IV. THÔNG TIN NGƯỜI MUA BẢO HIỂM (Nếu khác chủ xe)
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.nmbhHoTen"
                  label="Họ tên người mua"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.nmbhSdt"
                  label="Số điện thoại người mua"
                  outlined
                  dense
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <button style="display: none;" type="submit" @click="triggerSubmit"></button>
          <q-btn
            flat
            label="Hủy bỏ"
            color="grey-8"
            v-close-popup
            :disable="isSaving"
          />
          <q-btn
            label="Lưu hợp đồng"
            color="primary"
            :loading="isSaving"
            @click="triggerSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const $q = useQuasar();

// --- States Quản lý UI ---
const searchKeyword = ref('');
const statusFilter = ref('ALL');
const dialogOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const form = ref({});
const formRef = ref(null); // Ref để điều khiển kiểm tra dữ liệu q-form

const statusOptions = [
  { label: 'Tất cả trạng thái', value: 'ALL' },
  { label: 'Hiệu lực (Còn hạn trên 30 ngày)', value: 'HIEU_LUC' },
  { label: 'Sắp hết hạn (<= 30 ngày)', value: 'SAP_HET_HAN' },
  { label: 'Đã hết hạn', value: 'DA_HET_HAN' },
];

// --- GraphQL Query và Mutations ---
const TNDS_FRAGMENT = gql`
  fragment TndsDetails on TNDS {
    id
    userId
    user {
      id
      name
      email
    }
    chuXeHoTen soDienThoai email diaChi nmbhHoTen nmbhSdt bienSoXe loaiXe hangXe phienBan soKhung soMay namSanXuat soCho trongTai mucDichSuDung ngayDangKy soGcn ngayBatDau ngayHetHan phiBaoHiem trangThai ghiChu soNgayConLai
  }
`;

const GET_ALL_TNDS = gql`
  query GetAllTNDS {
    tnds {
      ...TndsDetails
    }
  }
  ${TNDS_FRAGMENT}
`;

const CREATE_TNDS = gql`
  mutation CreateTNDS($input: CreateTNDSInput!) {
    createTNDS(input: $input) {
      tnds { ...TndsDetails }
    }
  }
  ${TNDS_FRAGMENT}
`;

const UPDATE_TNDS = gql`
  mutation UpdateTNDS($input: UpdateTNDSInput!) {
    updateTNDS(input: $input) {
      tnds { ...TndsDetails }
    }
  }
  ${TNDS_FRAGMENT}
`;

const DELETE_TNDS = gql`
  mutation DeleteTNDS($input: DeleteTNDSInput!) {
    deleteTNDS(input: $input) {
      deletedId
      success
    }
  }
`;

// --- Thiết lập Apollo Client và Quản lý Cache ---

const { result, loading, error, refetch } = useQuery(GET_ALL_TNDS);

const { mutate: createTNDS, onDone: onCreateDone, onError: onCreateError } = useMutation(CREATE_TNDS, {
  update: (cache, { data: { createTNDS: payload } }) => {
    const cachedData = cache.readQuery({ query: GET_ALL_TNDS });
    if (cachedData && payload?.tnds) {
      cache.writeQuery({
        query: GET_ALL_TNDS,
        data: {
          tnds: [...cachedData.tnds, payload.tnds],
        },
      });
    }
  },
});

const { mutate: updateTNDS, onDone: onUpdateDone, onError: onUpdateError } = useMutation(UPDATE_TNDS, {
  update: (cache, { data: { updateTNDS: payload } }) => {
    const cachedData = cache.readQuery({ query: GET_ALL_TNDS });
    if (cachedData && payload?.tnds) {
      cache.writeQuery({
        query: GET_ALL_TNDS,
        data: {
          tnds: cachedData.tnds.map(item => (item.id === payload.tnds.id ? payload.tnds : item)),
        },
      });
    }
  },
});

const { mutate: executeDeleteTNDS, onDone: onDeleteDone, onError: onDeleteError } = useMutation(DELETE_TNDS, {
  update: (cache, { data: { deleteTNDS: payload } }) => {
    if (payload?.success) {
      const cachedData = cache.readQuery({ query: GET_ALL_TNDS });
      if (cachedData) {
        cache.writeQuery({
          query: GET_ALL_TNDS,
          data: {
            tnds: cachedData.tnds.filter(item => item.id !== payload.deletedId),
          },
        });
      }
    }
  },
});

const list = computed(() => result.value?.tnds ?? []);

watch(error, (newError) => {
  if (newError) {
    $q.notify({ type: 'negative', message: 'Không thể đồng bộ dữ liệu hợp đồng.' });
  }
});

const onSaveError = (err) => {
  console.error(err);
  const gqErrors = err?.graphQLErrors;
  const message = gqErrors && gqErrors.length > 0
    ? gqErrors[0].message
    : 'Lưu dữ liệu thất bại. Vui lòng kiểm tra lại.';
  $q.notify({ type: 'negative', message });
  isSaving.value = false;
};

onCreateError(onSaveError);
onUpdateError(onSaveError);

onCreateDone(() => {
  $q.notify({ type: 'positive', message: 'Tạo mới hợp đồng bảo hiểm thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
});

onUpdateDone(() => {
  $q.notify({ type: 'positive', message: 'Cập nhật thông tin bảo hiểm thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
});

onDeleteDone(() => {
  $q.notify({ type: 'positive', message: 'Đã xóa dữ liệu hợp đồng này.' });
});

onDeleteError((err) => {
  console.error(err);
  $q.notify({ type: 'negative', message: 'Không thể xóa thông tin hợp đồng bảo hiểm.' });
});

// --- Định dạng hiển thị phía Client ---
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  } catch (e) {
    return dateStr;
  }
};

const formatCurrency = (val) => {
  if (val == null) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

// --- Hành động xử lý (UI Methods) ---
const clearSearch = () => {
  searchKeyword.value = '';
};

const openCreateDialog = () => {
  isEditMode.value = false;
  form.value = { loaiXe: 'Ô tô', trangThai: 'Hiệu lực' };
  dialogOpen.value = true;
};

const openEditDialog = (item) => {
  isEditMode.value = true;
  const editableItem = { ...item };
  // Trích xuất ngày định dạng yyyy-MM-dd để khớp thẻ input date của HTML5
  if (editableItem.ngayDangKy) editableItem.ngayDangKy = editableItem.ngayDangKy.split('T')[0];
  if (editableItem.ngayBatDau) editableItem.ngayBatDau = editableItem.ngayBatDau.split('T')[0];
  if (editableItem.ngayHetHan) editableItem.ngayHetHan = editableItem.ngayHetHan.split('T')[0];
  form.value = editableItem;
  dialogOpen.value = true;
};

const confirmDelete = (item) => {
  $q.dialog({
    title: 'Xác nhận xóa bỏ',
    message: `Hệ thống sẽ xóa vĩnh viễn bảo hiểm của chủ xe "${item.chuXeHoTen}" (Biển số: ${item.bienSoXe || 'Chưa có'}). Thao tác này không thể phục hồi!`,
    cancel: { flat: true, label: 'Bỏ qua', color: 'grey-8' },
    ok: { color: 'negative', label: 'Đồng ý xóa' },
    persistent: true
  }).onOk(() => {
    executeDeleteTNDS({ input: { id: item.id } });
  });
};

// Kích hoạt tiến trình kiểm tra dữ liệu bằng tính năng Quasar QForm
const triggerSubmit = async () => {
  if (formRef.value) {
    const isValid = await formRef.value.validate();
    if (isValid) {
      save();
    } else {
      $q.notify({ type: 'negative', message: 'Vui lòng kiểm tra lại các trường thông tin bắt buộc (*).' });
    }
  }
};

const save = () => {
  isSaving.value = true;

  // Bản sao dọn dẹp các trường rác không thuộc Schema GraphQL Mutation Input [3.1]
  const inputData = { ...form.value };
  delete inputData.__typename;
  delete inputData.soNgayConLai;
  delete inputData.user;

  if (!isEditMode.value) {
    delete inputData.id;
  }

  // Ép kiểu các trường Số nguyên (Int)
  const integerFields = ['namSanXuat', 'soCho', 'userId'];
  for (const field of integerFields) {
    if (inputData[field] != null && inputData[field] !== '') {
      const num = parseInt(inputData[field], 10);
      inputData[field] = isNaN(num) ? null : num;
    } else {
      inputData[field] = null;
    }
  }

  // Ép kiểu các trường Số thực (Float)
  const floatFields = ['phiBaoHiem', 'trongTai'];
  for (const field of floatFields) {
    if (inputData[field] != null && inputData[field] !== '') {
      const num = parseFloat(inputData[field]);
      inputData[field] = isNaN(num) ? null : num;
    } else {
      inputData[field] = null;
    }
  }

  const variables = { input: inputData };

  if (isEditMode.value) {
    updateTNDS(variables);
  } else {
    createTNDS(variables);
  }
};

// --- Bộ lọc tìm kiếm động (Computed Filters) ---
const filteredList = computed(() => {
  let resultList = list.value;

  // 1. Lọc theo từ khóa tìm kiếm (Tên chủ xe hoặc biển số)
  if (searchKeyword.value) {
    const lowerKeyword = searchKeyword.value.toLowerCase();
    resultList = resultList.filter(item =>
      item.bienSoXe?.toLowerCase().includes(lowerKeyword) ||
      item.chuXeHoTen?.toLowerCase().includes(lowerKeyword)
    );
  }

  // 2. Lọc theo hạn hiệu lực hợp đồng (số ngày còn lại)
  if (statusFilter.value !== 'ALL') {
    resultList = resultList.filter(item => {
      const days = item.soNgayConLai;
      switch (statusFilter.value) {
        case 'DA_HET_HAN': return days < 0;
        case 'SAP_HET_HAN': return days >= 0 && days <= 30;
        case 'HIEU_LUC': return days > 30;
        default: return true;
      }
    });
  }
  return resultList;
});
</script>

<style scoped>
.scroll {
  overflow-y: auto;
}

/* Kiểu thiết kế thẻ bảo hiểm */
.contract-card {
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 250px;
}

.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

/* CSS mô phỏng biển số xe thực tế */
.license-plate-style {
  border: 1.5px solid #1976D2;
  border-radius: 4px;
  background-color: #f1f6fc;
  color: #0d47a1;
  font-family: 'Courier New', Courier, monospace;
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}
</style>
