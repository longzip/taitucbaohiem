<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4">Tra cứu thẻ BHYT</ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="timKiem"
        placeholder="Mã số BHXH"
        hint="Mã số cách nhau bởi dấu phẩy, nhấn Enter để tìm kiếm"
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
import { mapGetters } from "vuex";

import { Loading, QSpinnerIos } from "quasar";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import { api } from "src/boot/axios";
import client from "src/utils";
export default {
  components: { ThongTinTheBHYT, ListHeader },
  data() {
    return {
      searchText: "",
      bhyts: [],
    };
  },
  methods: {
    async timKiem() {
      window.close();
      // console.log(localStorage.getItem("setIsLogin"));
      if (
        this.searchText.length === 0 ||
        localStorage.getItem("setIsLogin") === ""
      )
        return;
      this.bhyts = [];
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      let maSoBhxhs = this.searchText.split(",");
      for (let index = 0; index < maSoBhxhs.length; index++) {
        const maSoBhxh = maSoBhxhs[index];
        try {
          await this.xem(maSoBhxh);
        } catch (error) {
          console.log(error);
        }
      }
      window.close();
      Loading.hide();
    },
    async luu(bhyt) {
      let { data } = await api.put(`/api/bhyts/${bhyt.maSoBhxh}`, bhyt);
      return data;
    },
    async xem(maSoBhxh) {
      let { data } = await client.get(
        `/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
          maSoBhxh.length - 10
        )}`
      );

      let { thongTinTK1, thongTinTheHGD } = data.result;
      if (thongTinTK1) {
        let theBHYT = await this.luu({
          ...thongTinTheHGD,
          maHoGd: thongTinTK1.maHoGd,
        });
        if (this.bhyts.length > 5) this.bhyts = [];
        this.bhyts.push(theBHYT);
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
  },
  async mounted() {
    if (!localStorage.getItem("setIsLogin")) this.$router.push("/auth");
    if (this.$route.query.q) this.searchText = this.$route.query.q;
    let { data } = await api.get("/api/maSoBhxhs");
    localStorage.setItem("dsMaSoBhxhsDaCapNhat", JSON.stringify(data));

    let maHoGds = await axios.get("/api/maHoGd");
    localStorage.setItem("maHoGds", JSON.stringify(maHoGds.data));

    let dsMaSoBhxhs = JSON.parse(localStorage.getItem("dsMaSoBhxhs"));
    console.log("danh sách mã số bh còn lại: " + dsMaSoBhxhs.length);
    console.log("Đã cập nhật thành công: " + data.length);
    let maSoBhxh = false;
    // let maSoBhxh = dsMaSoBhxhs.pop();
    while (maSoBhxh) {
      if (!data.includes(maSoBhxh)) {
        await this.xem(maSoBhxh);
        data.push(maSoBhxh);
      }
      maSoBhxh = dsMaSoBhxhs.pop();
      localStorage.setItem("dsMaSoBhxhs", JSON.stringify(dsMaSoBhxhs));
    }
    this.timKiem();
  },
};
</script>
