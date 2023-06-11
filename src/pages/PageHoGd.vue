<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >Danh sách thẻ BHYT theo hộ gia đình - {{ bhyts.length }} thẻ :
      đ {{ parseInt(tongTien).toLocaleString() }}
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
import { mapGetters, mapActions } from "vuex";
import { Loading, QSpinnerIos } from "quasar";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ThongTinTheBHYT, ListHeader },
  name: "IndexPage",
  data() {
    return {
      maHoGd: "",
      searchText: ""
    };
  },
  methods: {
    ...mapActions("bhyts", [
      "getAllBhyts",
      "dongBoDuLieu",
    ]),
    async timKiem(searchText){
      const thongSoTheBHYTs = searchText.split("|");
      if(thongSoTheBHYTs.length > 1) this.searchText = thongSoTheBHYTs[0]
      await this.dongBoDuLieu(this.searchText)
      this.$refs.inputSearch.select();
    },
    async loadData() {
      await this.getAllBhyts({
        maHoGd: this.maHoGd,
      });
    },
    async print() {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = `https://app.hotham.vn/thanh-vien-ho-gia-dinh/1/pdf?maSoBhxhs=${this.bhyts
        .map((i) => i.maSoBhxh)
        .join(",")}`;
      a.click();
    },
  },

  computed: {
    ...mapGetters("bhyts", ["bhyts","tongTien"]),
  },

  mounted() {
    this.maHoGd = this.$route.params.id;
    this.loadData();
  },
});
</script>
