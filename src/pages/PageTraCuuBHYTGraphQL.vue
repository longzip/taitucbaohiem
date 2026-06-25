<template>
  <q-page class="q-pa-md">
    <bhyt-header :loading="loading" @refresh="refetchAll" />

    <bhyt-filters
      v-model:searchText="searchText"
      v-model:selectedUser="selectedUser"
      v-model:selectedStatus="selectedStatus"
      :user-options="userOptions"
      :status-options="statusOptions"
      @search="search"
    >
      <template #summary>
        <bhyt-result-summary
          :search-text="searchText"
          :selected-user="selectedUser"
          :selected-status="selectedStatus"
          :count="bhyts.length"
        />
      </template>
    </bhyt-filters>

    <bhyt-card-list
      :bhyts="bhyts"
      :loading="loading"
      :error="error"
      @refetch="refetchAll"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { useQuasar, Notify } from "quasar";
import { useStore } from "vuex";

import BhytHeader from "src/components/bhyt/BhytHeader.vue";
import BhytFilters from "src/components/bhyt/BhytFilters.vue";
import BhytResultSummary from "src/components/bhyt/BhytResultSummary.vue";
import BhytCardList from "src/components/bhyt/BhytCardList.vue";

// GRAPHQL QUERIES
const BHYTS_QUERY = gql`
  query Bhyts($name: String, $userName: String, $trangThai: String) {
    bhyts(name: $name, userName: $userName, trangThai: $trangThai) {
      id
      maSoBhxh
      hoTen
      ngaySinhDt
      gioiTinh
      soCmnd
      maHoGd
      soDienThoai
      soDienThoai2
      email
      facebook
      diaChiLh
      ghiChu
      starRating
      trangThaiTaiTuc
      soTheBhyt
      tuNgayDt
      denNgayDt
      ngay5Nam
      maKCB
      tenDvi
      maToKhaiRieng
      tongTien
      ngayLap
      maBienLai
      maTraCuu
      soThang
      nguoiThuMay
      userName
      completed
      thuTruoc
      ngayThuTruoc
      soTienThuTruoc
      nhanVienThu
      ngayTraCuu
      createdAt
      updatedAt
      coTheUuTienCaoHon
      disabled
      updatedAt
    }
  }
`;




// COMPONENT SETUP
const $q = useQuasar();
const store = useStore();

// DATA STATES
const searchText = ref(null);
const selectedUser = ref(null);
const selectedStatus = ref(null);

// USER & STATUS OPTIONS

const userOptions = [
  { label: "Tất cả", value: null },
  { label: "142010_giaodichvien", value : '3152'}
];

const statusOptions = ref([
  { label: "Tất cả", value: null },
  { label: "Chưa tái tục", value: "Chưa tái tục" },
  { label: "Chưa đồng bộ 3 tháng", value: "Chưa đồng bộ" },
  { label: "Chưa liên hệ", value: "Chưa liên hệ" },
  { label: "Đã liên hệ", value: "Đã liên hệ" },
  { label: "Đã tái tục", value: "Đã tái tục" },
  { label: "Từ chối", value: "Từ chối" },
]);

// APOLLO QUERIES
const { result, loading, error, refetch: refetchBhyts, onResult: onBhytsResult } = useQuery(
  BHYTS_QUERY,
  () => ({
    name: searchText.value,
    userName: selectedUser.value,
    trangThai: selectedStatus.value,
  }),
  () => ({
    debounce: 500,
    // Kích hoạt khi có searchText (từ 2 ký tự trở lên) HOẶC có chọn user HOẶC có chọn trạng thái
    enabled: (!!searchText.value && searchText.value.length >= 10) ||
             !!selectedUser.value ||
             !!selectedStatus.value,
  })
);

const bhyts = useResult(result, [], (data) => data.bhyts);

// METHODS
const search = () => {
  if (searchText.value && searchText.value.length < 2) {
    Notify.create({ type: "warning", message: "Vui lòng nhập ít nhất 2 ký tự." });
    return;
  }
  refetchBhyts();
};

const refetchAll = () => {
  refetchBhyts();
   Notify.create({ type: "info", message: "Đang làm mới dữ liệu..." });
}

onBhytsResult((queryResult) => {
  if (queryResult.loading) {
    // No need to show loading here as we have a dedicated loading state
  } else if (queryResult.data) {
    Notify.create({
      type: "positive",
      message: `Tìm thấy ${queryResult.data.bhyts.length} kết quả.`,
      position: 'top-right',
      timeout: 2000
    });
  }
});
</script>
