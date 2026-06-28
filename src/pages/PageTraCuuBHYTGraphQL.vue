<template>
  <q-page class="q-pa-md">
    <bhyt-header
      :loading="loading"
      @refresh="refetchAll"
      @copy-phones="copyAllPhoneNumbers"
      @auto-lookup="toggleAutoLookup"
    />

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
import { useQuasar, Notify, copyToClipboard } from "quasar";
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
const isAutoLookupRunning = ref(false);
let autoLookupTimeout = null;

// USER & STATUS OPTIONS

const userOptions = [
  { label: "Tất cả", value: null },
  { label: "3152", value: "3152" }, // Đã có sẵn từ trước

  // Các mã tài khoản mới được bổ sung
  { label: "08986", value: "08986" },
  { label: "3154", value: "3154" },
  { label: "101130", value: "101130" },
  { label: "142010_giaodichvien", value: "142010_giaodichvien" },
  { label: "T8", value: "T8" },
  { label: "142010_Dam", value: "142010_Dam" },
  { label: "142010_truongbc", value: "142010_truongbc" },
  { label: "3172", value: "3172" },
  { label: "00457", value: "00457" },
  { label: "00043", value: "00043" },
  { label: "09019", value: "09019" },
  { label: "09799", value: "09799" },
  { label: "09004", value: "09004" },
  { label: "3148", value: "3148" },
  { label: "05917", value: "05917" },
  { label: "02665", value: "02665" },
  { label: "24919", value: "24919" },
  { label: "08944", value: "08944" },
  { label: "13561", value: "13561" },
  { label: "00001", value: "00001" },
  { label: "07846", value: "07846" },
  { label: "00463", value: "00463" },
  { label: "04339", value: "04339" },

  // Trạng thái NULL (Chưa phân công / Tài khoản trống)
  { label: "Chưa phân công (NULL)", value: "NULL" }
];


const statusOptions = ref([
  { label: "Tất cả trạng thái", value: null },

  // 1. Nhóm trạng thái theo thời gian hiệu lực (hệ thống tự động cập nhật)
  { label: "Còn hạn", value: "Còn hạn" },
  { label: "Thẻ ưu tiên (31/12)", value: "Thẻ ưu tiên" },
  { label: "Cần nhắc tái tục", value: "Cần nhắc tái tục" },
  { label: "Hết hạn dưới 3 tháng", value: "Hết hạn dưới 3 tháng" },
  { label: "Hết hạn quá 3 tháng", value: "Hết hạn quá 3 tháng" },

  // 2. Nhóm trạng thái tương tác và nghiệp vụ (nhân viên cập nhật thủ công)
  { label: "Chưa liên hệ", value: "Chưa liên hệ" },
  { label: "Đang liên hệ / Chờ phản hồi", value: "Đang liên hệ" }, // Hoặc "Đang liên hệ" tùy bạn lưu DB thế nào
  { label: "Từ chối", value: "Từ chối" },
  { label: "Đã thu tiền (Chờ nộp)", value: "Đã thu tiền" },
  { label: "Đã tái tục thành công", value: "Đã tái tục" }
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

const copyAllPhoneNumbers = () => {
  if (!bhyts.value || bhyts.value.length === 0) {
    Notify.create({
      type: "warning",
      message: "Không có dữ liệu BHYT để sao chép.",
    });
    return;
  }

  const phoneNumbers = bhyts.value
    .map((bhyt) => bhyt.soDienThoai2 || bhyt.soDienThoai)
    .filter(Boolean) // Lọc ra các giá trị null hoặc undefined
    .join(", ");

  if (phoneNumbers) {
    copyToClipboard(phoneNumbers)
      .then(() => {
        Notify.create({
          type: "positive",
          message: `Đã sao chép ${bhyts.value.length} số điện thoại vào clipboard.`,
        });
      })
      .catch(() => {
        Notify.create({
          type: "negative",
          message: "Lỗi khi sao chép số điện thoại.",
        });
      });
  } else {
    Notify.create({
      type: "info",
      message: "Không tìm thấy số điện thoại nào để sao chép.",
    });
  }
};

const toggleAutoLookup = () => {
  isAutoLookupRunning.value = !isAutoLookupRunning.value;
  if (isAutoLookupRunning.value) {
    startAutoLookup();
  } else {
    stopAutoLookup();
  }
};

const startAutoLookup = () => {
  if (!bhyts.value || bhyts.value.length === 0) {
    Notify.create({
      type: "warning",
      message: "Không có dữ liệu BHYT để tra cứu.",
    });
    isAutoLookupRunning.value = false;
    return;
  }

  Notify.create({
    type: "info",
    message: "Bắt đầu tra cứu tự động...",
  });

  let index = 0;
  const lookupNext = () => {
    if (index < bhyts.value.length && isAutoLookupRunning.value) {
      const bhyt = bhyts.value[index];
      const url = `https://ssm.vnpost.vn/qldv/tra-cuu/tra-cuu-thong-tin-the?maSoBHXH=${bhyt.maSoBhxh}&hoTen=${bhyt.hoTen}&ngaySinhDt=${bhyt.ngaySinhDt}`;
      window.open(url, "_blank");
      index++;
      autoLookupTimeout = setTimeout(lookupNext, 10000);
    } else {
      stopAutoLookup();
      Notify.create({
        type: "positive",
        message: "Đã hoàn tất tra cứu tự động.",
      });
    }
  };

  lookupNext();
};

const stopAutoLookup = () => {
  isAutoLookupRunning.value = false;
  if (autoLookupTimeout) {
    clearTimeout(autoLookupTimeout);
    autoLookupTimeout = null;
  }
  Notify.create({
    type: "info",
    message: "Đã dừng tra cứu tự động.",
  });
};
</script>
