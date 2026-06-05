<template>
  <q-page class="q-pa-md">
    <!-- Page Title & Refresh Button -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="directions_car" size="md" color="primary" class="q-mr-sm" />
        <div>
          <div class="text-h6 text-bold">Quản Lý Bảo Hiểm TNDS</div>
          <div class="text-caption text-grey">Danh sách hợp đồng bảo hiểm TNDS ô tô, xe máy</div>
        </div>
      </div>
      <div>
        <q-btn color="primary" icon="add_circle" label="Thêm Mới" @click="openCreateDialog" class="q-mr-sm" />
        <q-btn round flat color="primary" icon="refresh" @click="refetch()" :loading="loading">
          <q-tooltip>Tải lại danh sách</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Search & Filter -->
    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-8">
          <q-input v-model="searchKeyword" outlined dense placeholder="Tìm theo biển số xe, tên chủ xe..." clearable @clear="clearSearch">
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-select v-model="statusFilter" :options="statusOptions" option-value="value" option-label="label" emit-value map-options outlined dense label="Lọc theo trạng thái" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading & Empty State -->
    <div v-if="loading" class="row justify-center q-my-xl"><q-spinner color="primary" size="40px" /></div>
    <div v-else-if="filteredList.length === 0" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="no_transfer" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không có dữ liệu phù hợp</div>
    </div>

    <!-- Grid View -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="item in filteredList" :key="item.id" class="col-12 col-md-6 col-lg-4">
        <q-card @click="openEditDialog(item)" class="cursor-pointer">
          <q-card-section class="bg-grey-2 row items-center justify-between">
            <div class="row items-center">
              <q-avatar size="28px" :color="item.loaiXe === 'Ô tô' ? 'blue' : 'green'" text-color="white" :icon="item.loaiXe === 'Ô tô' ? 'directions_car' : 'two_wheeler'" class="q-mr-xs" />
              <div class="text-subtitle2 text-bold text-uppercase">{{ item.bienSoXe }}</div>
            </div>
            <q-badge :color="getStatusColor(item.trangThai, item.soNgayConLai)">{{ getStatusText(item.trangThai, item.soNgayConLai) }}</q-badge>
          </q-card-section>

          <q-card-section class="q-pa-sm q-gutter-y-xs" style="font-size: 13px;">
            <div class="text-bold">{{ item.chuXeHoTen }}</div>
            <div v-if="item.soDienThoai" class="row items-center">
              <q-icon name="phone" size="xs" class="q-mr-xs" />
              <a :href="'tel:' + item.soDienThoai" @click.stop class="text-body2" style="text-decoration: none; color: inherit;">{{ item.soDienThoai }}</a>
            </div>
            <div v-if="item.diaChi"><q-icon name="location_on" size="xs" class="q-mr-xs" />{{ item.diaChi }}</div>
            <div>{{ item.hangXe }} {{ item.phienBan }}</div>
            <q-separator class="q-my-xs"/>
            <div class="row justify-between items-center text-center">
              <div class="col">
                <div class="text-caption text-grey-8">Từ ngày</div>
                <div class="text-weight-bold">{{ formatDate(item.ngayBatDau) }}</div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-8">Đến ngày</div>
                <div class="text-weight-bold text-negative">{{ formatDate(item.ngayHetHan) }}</div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-8">Phí</div>
                <div class="text-weight-bold">{{ formatCurrency(item.phiBaoHiem) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 60vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ isEditMode ? 'Cập nhật thông tin' : 'Thêm mới hợp đồng' }}</div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><q-input v-model="form.chuXeHoTen" dense outlined label="Tên chủ xe"/></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.soDienThoai" dense outlined label="Số điện thoại"/></div>
            <div class="col-12"><q-input v-model="form.diaChi" dense outlined label="Địa chỉ"/></div>
            <div class="col-12 col-sm-4"><q-input v-model="form.bienSoXe" dense outlined label="Biển số xe"/></div>
            <div class="col-12 col-sm-4"><q-select v-model="form.loaiXe" :options="['Ô tô', 'Xe máy']" dense outlined label="Loại xe"/></div>
            <div class="col-12 col-sm-4"><q-input v-model="form.hangXe" dense outlined label="Hãng xe"/></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.soKhung" dense outlined label="Số khung"/></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.soMay" dense outlined label="Số máy"/></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.ngayBatDau" type="date" dense outlined stack-label label="Ngày bắt đầu"/></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.ngayHetHan" type="date" dense outlined stack-label label="Ngày hết hạn"/></div>
            <div class="col-12 col-sm-6"><q-input v-model.number="form.phiBaoHiem" type="number" dense outlined label="Phí bảo hiểm"/></div>
            <div class="col-12 col-sm-6"><q-select v-model="form.trangThai" :options="['Hiệu lực', 'Hết hạn', 'Cần tái tục']" dense outlined label="Trạng thái"/></div>
            <div class="col-12"><q-input v-model="form.ghiChu" type="textarea" dense outlined label="Ghi chú"/></div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Hủy" color="grey" v-close-popup />
          <q-btn :label="isEditMode ? 'Cập Nhật' : 'Lưu'" color="primary" @click="save" :loading="isSaving"/>
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

// States
const searchKeyword = ref('');
const statusFilter = ref('ALL');
const dialogOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const form = ref({});

const statusOptions = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Hiệu lực', value: 'HIEU_LUC' },
  { label: 'Sắp hết hạn (<= 30 ngày)', value: 'SAP_HET_HAN' },
  { label: 'Đã hết hạn', value: 'DA_HET_HAN' },
];

// GraphQL Operations
const TNDS_FRAGMENT = gql`
  fragment TndsDetails on TNDS {
    id chuXeHoTen soDienThoai email diaChi nmbhHoTen nmbhSdt bienSoXe loaiXe hangXe phienBan soKhung soMay namSanXuat soCho trongTai mucDichSuDung ngayDangKy soGcn ngayBatDau ngayHetHan phiBaoHiem trangThai ghiChu soNgayConLai
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
  mutation CreateTNDS($input: createTNDSInput!) {
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

// Apollo Composables
const { result, loading, error, refetch } = useQuery(GET_ALL_TNDS);
const { mutate: createTNDS, onDone: onCreateDone, onError: onSaveError } = useMutation(CREATE_TNDS);
const { mutate: updateTNDS, onDone: onUpdateDone } = useMutation(UPDATE_TNDS);

const list = computed(() => result.value?.tnds ?? []);

watch(error, (newError) => {
  if (newError) {
    $q.notify({ type: 'negative', message: 'Không thể tải dữ liệu.' });
  }
});

onSaveError((error) => {
  console.error(error);
  $q.notify({ type: 'negative', message: 'Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.' });
  isSaving.value = false;
});

onCreateDone(() => {
  $q.notify({ type: 'positive', message: 'Thêm mới thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
  refetch();
});

onUpdateDone(() => {
  $q.notify({ type: 'positive', message: 'Cập nhật thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
  refetch();
});


// Methods
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
  if (editableItem.ngayBatDau) editableItem.ngayBatDau = editableItem.ngayBatDau.split('T')[0];
  if (editableItem.ngayHetHan) editableItem.ngayHetHan = editableItem.ngayHetHan.split('T')[0];
  form.value = editableItem;
  dialogOpen.value = true;
};

const save = () => {
  isSaving.value = true;
  const input = { ...form.value };
  delete input.__typename;

  // Sanitize numeric fields
  const numericFields = ['phiBaoHiem', 'namSanXuat', 'soCho', 'trongTai'];
  for (const field of numericFields) {
    if (input[field]) input[field] = parseFloat(input[field]);
  }

  if (isEditMode.value) {
    updateTNDS({ input });
  } else {
    createTNDS({ input });
  }
};

// Computed
const filteredList = computed(() => {
  let result = list.value;
  if (searchKeyword.value) {
    const lowerKeyword = searchKeyword.value.toLowerCase();
    result = result.filter(item =>
      item.bienSoXe?.toLowerCase().includes(lowerKeyword) ||
      item.chuXeHoTen?.toLowerCase().includes(lowerKeyword)
    );
  }
  if (statusFilter.value !== 'ALL') {
    result = result.filter(item => {
      const days = item.soNgayConLai;
      switch (statusFilter.value) {
        case 'DA_HET_HAN': return days < 0;
        case 'SAP_HET_HAN': return days >= 0 && days <= 30;
        case 'HIEU_LUC': return days > 30;
        default: return true;
      }
    });
  }
  return result;
});

// UI Helpers
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};
const formatCurrency = (val) => val ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) : '0 đ';
const getStatusText = (status, days) => {
    if (days < 0) return 'Đã hết hạn';
    if (days <= 30) return `Sắp hết hạn (${days} ngày)`;
    return 'Hiệu lực';
};
const getStatusColor = (status, days) => {
    if (days < 0) return 'negative';
    if (days <= 30) return 'warning';
    return 'positive';
};

</script>