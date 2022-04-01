<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >Danh sách thẻ BHYT theo hộ gia đình:
      <a
        :href="`https://hgd.baohiemxahoi.gov.vn/doViewInfoHo.do?maHo=${maHoGd}`"
        target="_blank"
        >{{ maHoGd }}</a
      >

      <q-btn
        rounded
        color="primary"
        label="Tải"
        @click="dongBo()"
        icon="sync"
      />
      <q-btn
        color="deep-orange"
        rounded
        label="Xóa"
        @click="xacNhanXoa(maHoGd)"
        icon="delete_forever"
      />
    </ListHeader>
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
    };
  },
  methods: {
    ...mapActions("bhyts", ["getAllBhyts", "xoaHoGd", "dongBoDuLieu"]),
    async loadData() {
      await this.getAllBhyts({
        maHoGd: this.maHoGd,
      });
      // console.log("đồng bộ dữ liệu");
      // console.log(this.bhyts.map((bhyt) => bhyt.maSoBhxh).join());
    },
    async dongBo() {
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      await this.dongBoDuLieu(this.bhyts.map((bhyt) => bhyt.maSoBhxh).join());
      Loading.hide();
    },
    async xacNhanXoa(maHoGd) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn xóa hộ gia đình?",
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(async () => {
          await this.xoaHoGd(maHoGd);
          this.$router.go();
        });
    },
  },

  computed: {
    ...mapGetters("bhyts", ["bhyts"]),
  },

  mounted() {
    this.maHoGd = this.$route.params.id;
    this.loadData();
  },
});
</script>
