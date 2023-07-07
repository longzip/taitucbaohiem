<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4"
      >{{ bhyts.length }} Hồ Sơ Chưa Xử Lý (Tổng:
      {{ tongTien.toLocaleString() }}đ / {{ tongHoSo }} HS)<q-btn
        rounded
        color="primary"
        label="Tải"
        @click="dongBo()"
        icon="sync"
    /></ListHeader>

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
export default {
  components: { ThongTinTheBHYT, ListHeader },
  data() {
    return {
      searchText: "",
      items: [],
      tongTien: 0,
      tongHoSo: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["isLogin", "userDetails"]),
    ...mapGetters("bhyts", ["bhyts"]),
  },
  methods: {
    ...mapActions("bhyts", ["hoSoChuaXuLy", "giaHan"]),
    dongBo() {
      this.giaHan(this.bhyts);
    },
  },
  async mounted() {
    if (this.$route.query.q) {
      this.searchText = this.$route.query.q;
    }
    await this.hoSoChuaXuLy({ mangLuoiId: this.userDetails.mangLuoiId });
    this.tongTien = this.bhyts
      .filter((t) => t.userId == 3152 && t.trangThaiHoSo == 2)
      .map((t) => t.tongTien)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    this.tongHoSo = this.bhyts
      .filter((t) => t.userId == 3152 && t.trangThaiHoSo == 2)
      .map((t) => t.tongTien)
      .reduce((previousValue, currentValue) => previousValue + 1, 0);
    this.giaHan(
      this.bhyts.filter(
        (t) =>
          t.trangThaiHoSo == 2 &&
          new Date().getDate() === new Date(t.ngayLap).getDate()
      )
    );
  },
};
</script>
