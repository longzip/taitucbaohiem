<template>
  <q-page class="q-pa-md">
    <tnds-header
      :loading="loading"
      @create="openCreateDialog"
      @refresh="refetch"
    />
    <tnds-filter
      v-model:searchTerm="searchKeyword"
      v-model:status="statusFilter"
      :status-options="statusOptions"
      @clear="clearSearch"
    />
    <tnds-contract-list
      :contracts="filteredList"
      :loading="loading"
      @edit="openEditDialog"
    />
    <tnds-create-edit-dialog
      v-model="dialogOpen"
      v-model:form="form"
      :is-edit-mode="isEditMode"
      :is-saving="isSaving"
      @save="save"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import TndsHeader from 'src/components/tnds/TndsHeader.vue';
import TndsFilter from 'src/components/tnds/TndsFilter.vue';
import TndsContractList from 'src/components/tnds/TndsContractList.vue';
import TndsCreateEditDialog from 'src/components/tnds/TndsCreateEditDialog.vue';

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

// Apollo Composables
const { result, loading, error, refetch } = useQuery(GET_ALL_TNDS);

const { mutate: createTNDS, onDone: onCreateDone, onError: onCreateError } = useMutation(CREATE_TNDS, {
  update: (cache, { data: { createTNDS: result } }) => {
    const data = cache.readQuery({ query: GET_ALL_TNDS });
    if (data && result) {
      cache.writeQuery({
        query: GET_ALL_TNDS,
        data: {
          tnds: [...data.tnds, result.tnds],
        },
      });
    }
  },
});

const { mutate: updateTNDS, onDone: onUpdateDone, onError: onUpdateError } = useMutation(UPDATE_TNDS, {
  update: (cache, { data: { updateTNDS: result } }) => {
    const data = cache.readQuery({ query: GET_ALL_TNDS });
    if (data && result) {
      cache.writeQuery({
        query: GET_ALL_TNDS,
        data: {
          tnds: data.tnds.map(t => (t.id === result.tnds.id ? result.tnds : t)),
        },
      });
    }
  },
});

const list = computed(() => result.value?.tnds ?? []);

watch(error, (newError) => {
  if (newError) {
    $q.notify({ type: 'negative', message: 'Không thể tải dữ liệu.' });
  }
});

const onSaveError = (error) => {
  console.error(error);
  $q.notify({ type: 'negative', message: 'Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu và các trường bắt buộc.' });
  isSaving.value = false;
};

onCreateError(onSaveError);
onUpdateError(onSaveError);

onCreateDone(() => {
  $q.notify({ type: 'positive', message: 'Thêm mới thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
});

onUpdateDone(() => {
  $q.notify({ type: 'positive', message: 'Cập nhật thành công!' });
  dialogOpen.value = false;
  isSaving.value = false;
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
  const { chuXeHoTen, bienSoXe, ngayHetHan, phiBaoHiem } = form.value;
  if (!chuXeHoTen || !bienSoXe || !ngayHetHan || !phiBaoHiem || parseFloat(phiBaoHiem) <= 0) {
    $q.notify({ type: 'negative', message: 'Vui lòng điền đầy đủ các trường bắt buộc (*).' });
    return;
  }

  isSaving.value = true;
  const inputData = { ...form.value };
  delete inputData.__typename;
  delete inputData.soNgayConLai;

  const numericFields = ['phiBaoHiem', 'namSanXuat', 'soCho', 'trongTai'];
  for (const field of numericFields) {
    if (inputData[field] != null) {
      const num = parseFloat(inputData[field]);
      inputData[field] = isNaN(num) ? null : num;
    }
  }

  const variables = { input: inputData };

  if (isEditMode.value) {
    updateTNDS(variables);
  } else {
    createTNDS(variables);
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
</script>
