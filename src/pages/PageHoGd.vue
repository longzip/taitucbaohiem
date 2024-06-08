<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >Hộ gia đình {{ bhyts.length }} người. Số tiền thu: đ
      {{ parseInt(tongTienBHYTDaThu + tongTienBHXHDaThu).toLocaleString() }}/{{
        bhyts.filter((b) => b.isBHYT == 1 || b.isBHXHTN == 1).length
      }}
      <q-btn rounded color="primary" @click="print()" icon="print" />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        ref="inputSearch"
        @keyup.enter="timKiem(searchText)"
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
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions, mapState } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ThongTinTheBHYT, ListHeader },
  name: "IndexPage",
  data() {
    return {
      maHoGd: "",
      uniqid: "",
      searchText: "",
    };
  },
  methods: {
    ...mapActions("bhyts", ["getAllBhyts", "dongBoDuLieu"]),
    async timKiem(searchText) {
      const thongSoTheBHYTs = searchText.split("|");
      if (thongSoTheBHYTs.length > 1) this.searchText = thongSoTheBHYTs[0];
      await this.dongBoDuLieu(this.searchText);
      this.$refs.inputSearch.select();
    },
    async loadData() {
      if (this.uniqid)
        await this.getAllBhyts({
          uniqid: this.uniqid,
        });
      else
        await this.getAllBhyts({
          maHoGd: this.maHoGd,
        });
    },
    async print() {
      if (this.bhyts.length > 15) return;
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = `https://lws.hotham.vn/wordpress/wp-content/app/thanh-vien-ho-gia-dinh/1/pdf?maXaUpdate=${
        this.userDetails.maXa
      }&maSoBhxhs=${this.bhyts.map((i) => i.maSoBhxh).join(",")}`;
      a.click();
    },
  },

  computed: {
    ...mapGetters("bhyts", ["bhyts", "tongTienBHYTDaThu", "tongTienBHXHDaThu"]),
    ...mapState("auth", ["userDetails"]),
  },

  mounted() {
    this.maHoGd = this.$route.params.id;
    if (this.maHoGd.length === 13) this.uniqid = this.maHoGd;
    this.loadData();
  },
});
</script>
