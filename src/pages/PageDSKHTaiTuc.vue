<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">
      Danh sách khách hàng tái tục BHXH {{ khachHangTaiTucs.length }}/Tổng:
      {{ tongCong.toLocaleString() }}
    </ListHeader>
    <q-list v-for="khachHang in khachHangTaiTucs" :key="khachHang.maSoBHXH">
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ khachHang.hoVaTen }}
            {{ khachHang.ngayThangNamSinh }}</q-item-label
          >
          <q-item-label caption lines="2"
            >Mã số BHXH:
            <a
              target="_blank"
              :href="`https://app.buudienxatulap.ga/#/tra-cuu?q=${khachHang.maSoBHXH}`"
              >{{ khachHang.maSoBHXH }}</a
            ></q-item-label
          >
          <q-item-label caption lines="2">{{ khachHang.diaChi }}</q-item-label>
          <q-item-label caption lines="2"
            ><a :href="`tel:${khachHang.soDienThoai}`">{{
              khachHang.soDienThoai
            }}</a></q-item-label
          >
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ khachHang.ngayDenHan }}</q-item-label>
          <q-item-label caption
            >Số tiền: {{ parseInt(khachHang.soPhaiDong).toLocaleString() }} /
            {{ khachHang.phuongThuc }} tháng</q-item-label
          >
        </q-item-section></q-item
      >
      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script>
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import client from "../utils";
import { Loading, QSpinnerIos } from "quasar";
export default {
  components: { ListHeader },
  data() {
    return {
      khachHangTaiTucs: [],
      tongCong: 0,
    };
  },
  methods: {
    async loadData() {
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      const { data } = await client.post(
        "/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
        {
          denThang: "2023-01-01 00:00:00",
          filterItems: [],
          loaiDichVu: 0,
          mangLuoiId: 4580,
          maxResultCount: 500,
          skipCount: 0,
          tuThang: "2022-04-01 00:00:00",
          type: -1,
        }
      );
      const { result, error } = data;
      if (!error) {
        this.khachHangTaiTucs = result.items;
        this.tongCong = await result.items
          .map((t) => t.soPhaiDong)
          .reduce(
            (previousValue, currentValue) =>
              previousValue + parseInt(currentValue),
            0
          );
      }
      Loading.hide();
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
