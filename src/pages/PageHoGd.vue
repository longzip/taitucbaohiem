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
        color="primary"
        label="Xóa hộ gia đình"
        @click="xacNhanXoa(maHoGd)"
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
    ...mapActions("bhyts", ["getAllBhyts", "xoaHoGd"]),
    loadData() {
      this.getAllBhyts({
        maHoGd: this.maHoGd,
      });
    },
    async xacNhanXoa(maHoGd) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn loại bỏ?",
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
