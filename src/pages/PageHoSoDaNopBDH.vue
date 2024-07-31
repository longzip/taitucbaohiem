<template>
  <q-page v-if="userDetails.isPro">
    <ListHeader bgcolor="bg-orange-4"
      >Hồ Sơ Đã Nộp BDH (Tổng: {{ tongTien.toLocaleString() }}đ /
      {{ tongHoSo }} HS)</ListHeader
    >
    <q-list
      v-for="bhyt in bhyts.filter(
        (t) => t.userId == this.userDetails.id && t.trangThaiHoSo == 4
      )"
      :key="bhyt.id"
    >
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
      tongTien: 0,
      tongHoSo: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["isLogin", "userDetails"]),
    ...mapGetters("bhyts", ["bhyts"]),
  },
  methods: {
    ...mapActions("bhyts", ["hoSoDaXuLy", "giaHan"]),

    sleep(t) {
      return new Promise((resolve) => setTimeout(resolve, t));
    },
  },
  async mounted() {
    await this.hoSoDaXuLy({
      mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
    });
    this.tongTien = this.bhyts
      .filter((t) => t.userId == this.userDetails.id && t.trangThaiHoSo == 4)
      .map((t) => t.tongTien)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    this.tongHoSo = this.bhyts.filter(
      (t) => t.userId == this.userDetails.id && t.trangThaiHoSo == 4
    ).length;
  },
};
</script>
