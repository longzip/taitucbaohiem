<template>
  <q-page class="q-pa-md">
    <mic-header
      :loading="loading"
      @create="openCreateContractDialog"
      @refresh="refetch"
    />
    <mic-filter
      v-model:searchTerm="searchTerm"
      v-model:status="statusFilter"
      :status-options="statusOptions"
      :match-count="filteredContracts.length"
      @search="refetch"
      @clear="clearSearch"
    />
    <mic-contract-list
      :contracts="filteredContracts"
      :loading="loading"
      @view-history="openHistoryDialog"
      @record-payment="openRecordPaymentDialog"
      @update-payment="openUpdatePaymentDialog"
    />
    <mic-record-payment-dialog
      v-model="recordPaymentDialog"
      v-model:payment="paymentForm"
      @submit="handlePaymentSubmit"
      @cancel-payment="handleCancelPayment"
    />
    <mic-create-contract-dialog
      v-model="createContractDialog"
      v-model:maSoBhxh="newContractBhxh"
      @submit="handleCreateContract"
    />
    <mic-history-dialog
      v-model="historyDialog"
      :history="historyData"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import MicHeader from 'src/components/mic/MicHeader.vue';
import MicFilter from 'src/components/mic/MicFilter.vue';
import MicContractList from 'src/components/mic/MicContractList.vue';
import MicRecordPaymentDialog from 'src/components/mic/MicRecordPaymentDialog.vue';
import MicCreateContractDialog from 'src/components/mic/MicCreateContractDialog.vue';
import MicHistoryDialog from 'src/components/mic/MicHistoryDialog.vue';

const $q = useQuasar();

// Component States
const searchTerm = ref('');
const statusFilter = ref('ALL');

const recordPaymentDialog = ref(false);
const paymentForm = ref({});

const createContractDialog = ref(false);
const newContractBhxh = ref('');

const historyDialog = ref(false);
const historyData = ref(null);

const statusOptions = [
  { label: 'Tất cả trạng thái', value: 'ALL' },
  { label: 'Hiệu lực thường', value: 'HIEU_LUC' },
  { label: 'Sắp hết hạn (<= 30 ngày)', value: 'SAP_HET_HAN' },
  { label: 'Đã hết hạn (< 0 ngày)', value: 'DA_HET_HAN' },
  { label: 'Chờ biên lai (Đã thu tiền)', value: 'CHO_DUYET' }
];

// GraphQL
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
`;

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
`;

const MUTATION_HUY_THU = gql`
  mutation HuyThu($idLog: Int!) {
    huyThuMic(input: { idLog: $idLog }) {
      success
      message
    }
  }
`;

const MUTATION_TAO_HOP_DONG_TU_BHYT = gql`
  mutation TaoHopDongMicTuBhyt($maSoBhxh: String!) {
    taoHopDongMicTuBhyt(input: { maSoBhxh: $maSoBhxh }) {
      success
      message
    }
  }
`;

const { result, loading, error, refetch } = useQuery(
  QUERY_TAT_CA_KH, 
  () => ({ searchKeyword: searchTerm.value ? searchTerm.value.trim() : null}), 
  { fetchPolicy: 'network-only' }
);

const { mutate: thuTien, onDone: onThuTienDone, onError: onThuTienError } = useMutation(MUTATION_THU_TIEN);
const { mutate: huyThu, onDone: onHuyThuDone, onError: onHuyThuError } = useMutation(MUTATION_HUY_THU);
const { mutate: taoHopDong, onDone: onTaoHopDongDone, onError: onTaoHopDongError } = useMutation(MUTATION_TAO_HOP_DONG_TU_BHYT);

const contracts = computed(() => result.value?.danhSachTatCaMicDon ?? []);

watch(error, (newError) => {
  if (newError) {
    $q.notify({ type: 'negative', message: 'Lỗi khi tải dữ liệu. Vui lòng thử lại.' });
  }
});

const filteredContracts = computed(() => {
  if (statusFilter.value === 'ALL') {
    return contracts.value;
  }
  return contracts.value.filter(item => {
    const status = item.trangThaiDon;
    const days = item.soNgayConLai;

    switch (statusFilter.value) {
      case 'CHO_DUYET':
        return status === 'Da thu tien';
      case 'DA_HET_HAN':
        return days < 0 && status !== 'Da thu tien';
      case 'SAP_HET_HAN':
        return days >= 0 && days <= 30 && status !== 'Da thu tien';
      case 'HIEU_LUC':
        return days > 30 && status !== 'Da thu tien';
      default:
        return true;
    }
  });
});

function clearSearch() {
  searchTerm.value = '';
  refetch();
}

// Dialog and Form Handlers
function openCreateContractDialog() {
  newContractBhxh.value = '';
  createContractDialog.value = true;
}

function handleCreateContract() {
  if (!newContractBhxh.value || !newContractBhxh.value.trim()) {
    $q.notify({ type: 'warning', message: 'Vui lòng nhập Mã số BHXH.' });
    return;
  }
  $q.loading.show({ message: 'Đang tạo hợp đồng...' });
  taoHopDong({ maSoBhxh: newContractBhxh.value.trim() });
}

onTaoHopDongDone(({ data }) => {
  $q.loading.hide();
  if (data.taoHopDongMicTuBhyt?.success) {
    $q.notify({ type: 'positive', message: data.taoHopDongMicTuBhyt.message || 'Tạo hợp đồng thành công!' });
    createContractDialog.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.taoHopDongMicTuBhyt?.message || 'Có lỗi xảy ra khi tạo hợp đồng.' });
  }
});

onTaoHopDongError((error) => {
  $q.loading.hide();
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
});

function openRecordPaymentDialog(contract) {
  paymentForm.value = {
    idHopDong: contract.idHopDong,
    idLog: null,
    tenKhachHang: contract.ndbhHoTen,
    soHoaDon: '',
    maTraCuu: '',
    phuongThuc: 'Chuyen khoan',
    tiLeHoaHong: 20
  };
  recordPaymentDialog.value = true;
}

function openUpdatePaymentDialog(contract) {
  const lichSu = contract.lichSuChuaDuyet;
  if (!lichSu) return;

  paymentForm.value = {
    idHopDong: contract.idHopDong,
    idLog: lichSu.idLog,
    tenKhachHang: contract.ndbhHoTen,
    soHoaDon: lichSu.soHoaDon || '',
    maTraCuu: lichSu.maTraCuu || '',
    phuongThuc: lichSu.phuongThuc || 'Chuyen khoan',
    tiLeHoaHong: lichSu.tiLeHoaHong || 20
  };
  recordPaymentDialog.value = true;
}

function handlePaymentSubmit() {
  const f = paymentForm.value;
  $q.loading.show({ message: 'Đang lưu lịch sử...' });
  thuTien({
    idHopDong: parseInt(f.idHopDong),
    idLog: f.idLog ? parseInt(f.idLog) : null,
    soHoaDon: f.soHoaDon ? f.soHoaDon.trim() : "",
    maTraCuu: f.maTraCuu ? f.maTraCuu.trim() : "",
    phuongThuc: f.phuongThuc,
    tiLeHoaHong: parseFloat(f.tiLeHoaHong)
  });
}

onThuTienDone(({ data }) => {
  $q.loading.hide();
  if (data.thuTienMic?.success) {
    $q.notify({ type: 'positive', message: data.thuTienMic.message || 'Đã ghi nhận lịch sử thành công!' });
    recordPaymentDialog.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.thuTienMic?.message || 'Có lỗi xảy ra.' });
  }
});

onThuTienError((error) => {
  $q.loading.hide();
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
});

function handleCancelPayment() {
  const idLog = paymentForm.value.idLog;
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

onHuyThuDone(({ data }) => {
  $q.loading.hide();
  if (data.huyThuMic?.success) {
    $q.notify({ type: 'positive', message: 'Đã hủy thu thành công!' });
    recordPaymentDialog.value = false;
    refetch();
  } else {
    $q.notify({ type: 'negative', message: data.huyThuMic?.message || 'Có lỗi xảy ra khi hủy thu.' });
  }
});

onHuyThuError((error) => {
  $q.loading.hide();
  $q.notify({ type: 'negative', message: 'Lỗi kết nối API GraphQL.' });
  console.error(error);
});

function openHistoryDialog(contract) {
  historyData.value = contract;
  historyDialog.value = true;
}
</script>
