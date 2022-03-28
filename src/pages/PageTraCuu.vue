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
import axios from "axios";
import { Loading, QSpinnerIos } from "quasar";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
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
      console.log(localStorage.getItem("setIsLogin"));
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
      Loading.hide();
    },
    async luu(bhyt) {
      let { data } = await axios.put(
        `https://cmsbudientulap.herokuapp.com/api/bhyts/${bhyt.maSoBhxh}`,
        bhyt
      );
      return data;
    },
    async xem(maSoBhxh) {
      let { data } = await axios.get(
        `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
          maSoBhxh.length - 10
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("setIsLogin")}`,
          },
        }
      );

      let theBHYT = await this.luu({
        ...data.result.thongTinTheHGD,
        maHoGd: data.result.thongTinTK1.maHoGd,
      });
      this.bhyts.push(theBHYT);
    },
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
  },
  mounted() {
    if (!localStorage.getItem("setIsLogin")) this.$router.push("/auth");
    if (this.$route.query.q) this.searchText = this.$route.query.q;
    this.timKiem();
  },
};
</script>
