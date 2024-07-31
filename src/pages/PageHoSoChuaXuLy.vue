<template>
  <q-page v-if="userDetails.isPro">
    <ListHeader bgcolor="bg-orange-4"
      >{{ bhyts.length }} Hồ Sơ Chưa Xử Lý (BHYT:
      {{ tongTienBHYT.toLocaleString() }}đ / {{ soTheBHYT }} Thẻ + BHXH: :
      {{ tongTienBHXH.toLocaleString() }}đ / {{ soSoBHXH }})</ListHeader
    >

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
      tongTienBHYT: 0,
      tongTienBHXH: 0,
      soTheBHYT: 0,
      soSoBHXH: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["userDetails"]),
    ...mapGetters("bhyts", ["bhyts"]),
  },
  methods: {
    ...mapActions("bhyts", ["hoSoChuaXuLy"]),
  },
  async mounted() {
    await this.hoSoChuaXuLy({
      mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
    });
    this.tongTienBHYT = this.bhyts
      .filter(
        (t) =>
          t.userId == this.userDetails.id &&
          t.trangThaiHoSo == 2 &&
          t.maThuTuc === 1
      )
      .map((t) => t.tongTien)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    this.soTheBHYT = this.bhyts.filter(
      (t) =>
        t.userId == this.userDetails.id &&
        t.trangThaiHoSo == 2 &&
        t.maThuTuc === 1
    ).length;

    this.tongTienBHXH = this.bhyts
      .filter(
        (t) =>
          t.userId == this.userDetails.id &&
          t.trangThaiHoSo == 2 &&
          t.maThuTuc === 0
      )
      .map((t) => t.tongTien)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    this.soSoBHXH = this.bhyts.filter(
      (t) =>
        t.userId == this.userDetails.id &&
        t.trangThaiHoSo == 2 &&
        t.maThuTuc === 0
    ).length;
  },
};
</script>
