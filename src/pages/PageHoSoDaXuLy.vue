<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4"
      ><q-btn
        rounded
        color="primary"
        label="Tháng trước"
        @click="xemThangTruoc()"
        icon="arrow_back"
      />
      {{ bhyts.length }} Hồ Sơ Đã Xử Lý (T-L: {{ tham.toLocaleString()}}-{{ tongTien.toLocaleString()}}đ) / Đã nộp BHYT: {{daNopBHYT.toLocaleString()}} - Đã nộp BHXH: {{daNopBHXH.toLocaleString()}}
      <q-btn rounded color="primary" @click="dongBo()" icon="sync" />
      <q-btn
        rounded
        color="primary"
        @click="copyTextToClipboard()"
        icon="content_copy"
      />
      
      </ListHeader>

    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="traCuuTheoTen(searchText)"
        placeholder="Họ và tên"
        hint="Nhập họ và tên rồi nhấn Enter để tìm kiếm"
        dense
      >
        <template v-slot:append>
          <q-icon
            v-if="searchText !== ''"
            name="close"
            @click="searchText = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <ThongTinTheBHYT :bhyt="bhyt" />
      <q-separator spaced inset />
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import { Notify } from "quasar";
export default {
  components: { ThongTinTheBHYT, ListHeader },
  data() {
    return {
      searchText: "",
      tham: 0,
      tongTien: 0,
      thangTruoc: 0,
      daNopBHYT: 0,
      daNopBHXH: 0
    };
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
    ...mapGetters("bhyts", ["bhyts", "soDienThoais"]),
  },
  methods: {
    ...mapActions("bhyts", ["hoSoDaXuLy", "daXyLy"]),
    dongBo() {
      this.daXyLy(this.bhyts);
    },
    copyTextToClipboard() {
      navigator.clipboard
        .writeText([...new Set(this.soDienThoais)].join())
        .then(
          function () {
            Notify.create({
              type: "positive",
              message: `Bạn đã sao chép thành công!`,
            });
          },
          function (err) {
            Notify.create({
              type: "negative",
              message: "Không thực hiện được!" + err,
            });
          }
        );
    },
    xemThangTruoc(){
      this.thangTruoc = this.thangTruoc + 1;
      this.loadData();
    },
    async loadData(){
      await this.hoSoDaXuLy({thangTruoc: this.thangTruoc});
      this.tham = await this.bhyts.filter(t=>t.userId === 3152 && t.trangThaiHoSo === 9 && t.maThuTuc ===1).map(t=>t.tongTien).reduce(
        ( previousValue, currentValue ) => previousValue + currentValue,
        0
      );
      this.daNopBHYT = await this.bhyts.filter(t=>t.userId === 3152 && t.trangThaiHoSo === 4 && t.maThuTuc ===1).map(t=>t.tongTien).reduce(
        ( previousValue, currentValue ) => previousValue + currentValue,
        0
      );
      this.daNopBHXH = await this.bhyts.filter(t=>t.userId === 3152 && t.trangThaiHoSo === 4 && t.maThuTuc ===0).map(t=>t.tongTien).reduce(
        ( previousValue, currentValue ) => previousValue + currentValue,
        0
      );
      this.tongTien = await this.bhyts.filter(t=>t.userId === 3154 && t.trangThaiHoSo === 9 && t.maThuTuc ===1).map(t=>t.tongTien).reduce(
        ( previousValue, currentValue ) => previousValue + currentValue,
        0
      );
    }
  },
  async mounted() {
    this.loadData();
  },
};
</script>
