<template>
  <q-page class="q-pa-md">
    <!-- THANH TIÊU ĐỀ & NÚT LÀM MỚI -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="search" size="md" color="primary" class="q-mr-sm" />
        <div>
          <div class="text-h6 text-bold">Tra Cứu Thông Tin BHYT</div>
          <div class="text-caption text-grey">Tra cứu, quản lý và tái tục thẻ BHYT</div>
        </div>
      </div>
      <q-btn
        round
        flat
        color="primary"
        icon="refresh"
        @click="refetchAll"
        :loading="loading"
      >
        <q-tooltip>Làm mới dữ liệu</q-tooltip>
      </q-btn>
    </div>

    <!-- THANH TÌM KIẾM & COMBOBOX LỌC -->
    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-sm items-center">
        <div class="col-12 col-md-5">
          <q-input
            v-model="searchText"
            outlined
            dense
            placeholder="Gõ để tìm kiếm (Họ tên, Mã số BHXH, Thẻ BHYT)..."
            @keyup.enter="search"
            clearable
            @clear="searchText = null"
          >
            <template v-slot:append>
              <q-icon name="search" @click="search" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedUser"
            :options="userOptions"
            label="Lọc theo người dùng"
            outlined
            dense
            emit-value
            map-options
            clearable
          >
             <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            label="Lọc theo trạng thái"
            outlined
            dense
            emit-value
            map-options
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="filter_alt" />
            </template>
          </q-select>
        </div>
      </q-card-section>

       <!-- TÓM TẮT KẾT QUẢ VÀ BỘ LỌC -->
      <q-card-section v-if="searchText || selectedUser || selectedStatus" class="bg-grey-2 row items-center justify-between text-caption q-px-md q-py-sm">
        <div>
          Đang áp dụng bộ lọc:
          <strong v-if="searchText">Từ khóa "{{ searchText }}" </strong>
          <strong v-if="selectedUser">| Người dùng: {{ selectedUser }} </strong>
          <strong v-if="selectedStatus">| Trạng thái: {{ selectedStatus }}</strong>
        </div>
        <q-badge color="primary">Tìm thấy: {{ bhyts.length }} thẻ</q-badge>
      </q-card-section>
    </q-card>

    <!-- THỐNG KÊ -->
    <q-card class="q-mb-md" v-if="stats">
      <q-card-section class="row q-col-gutter-sm items-center">
        <div class="col-4 text-center">
          <div class="text-h6 text-bold">{{ stats.total }}</div>
          <div class="text-caption">Tổng số thẻ</div>
        </div>
        <div class="col-4 text-center">
          <div class="text-h6 text-bold text-positive">{{ stats.active }}</div>
          <div class="text-caption">Đang hoạt động</div>
        </div>
        <div class="col-4 text-center">
          <div class="text-h6 text-bold text-negative">{{ stats.expired }}</div>
          <div class="text-caption">Đã hết hạn</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- TRẠNG THÁI LOADING -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>
    <!-- TRẠNG THÁI LỖI -->
    <div v-else-if="error" class="column items-center justify-center q-my-xl text-negative">
      <q-icon name="error" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Lỗi khi tải dữ liệu: {{ error.message }}</div>
      <q-btn label="Thử lại" @click="refetchAll" color="primary" class="q-mt-md"/>
    </div>
    <!-- TRẠNG THÁI DANH SÁCH TRỐNG -->
    <div v-else-if="!bhyts || bhyts.length === 0" class="column items-center justify-center q-my-xl text-grey">
      <q-icon name="person_search" size="64px" />
      <div class="text-subtitle1 q-mt-sm">Không tìm thấy kết quả nào.</div>
       <div class="text-caption">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
    </div>

    <!-- LƯỚI HIỂN THỊ KẾT QUẢ -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="bhyt in bhyts"
        :key="bhyt.id"
        class="col-12 col-md-6"
      >
        <ThongTinTheBHYT :bhyt="bhyt" />
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { useQuasar, Notify } from "quasar";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import { useStore } from "vuex";

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
      updated_at
    }
  }
`;

const BHYT_STATS_QUERY = gql`
  query BhytStats($userName: String) {
    bhytStats(userName: $userName) {
      total
      active
      expired
    }
  }
`;

const COLLABORATORS_QUERY = gql`
  query Collaborators {
    collaborators {
      label
      value
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
const { result: collaboratorsResult, refetch: refetchCollaborators } = useQuery(COLLABORATORS_QUERY);
const userOptions = useResult(collaboratorsResult, [], (data) => [
  { label: "Tất cả", value: null },
  ...data.collaborators,
]);

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
    enabled: computed(() => !!searchText.value || !!selectedUser.value || !!selectedStatus.value),
  })
);

const { result: statsResult, refetch: refetchStats } = useQuery(
  BHYT_STATS_QUERY,
  () => ({
    userName: selectedUser.value,
  })
);

const bhyts = useResult(result, [], (data) => data.bhyts);
const stats = useResult(statsResult, null, (data) => data.bhytStats);

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
  refetchStats();
  refetchCollaborators();
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

<style scoped>
.text-h6 {
  font-size: 1.1rem;
}
.q-card {
  transition: box-shadow 0.3s;
}
.q-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
