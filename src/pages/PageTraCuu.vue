<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4"
      >Tra cứu thẻ BHYT: ({{ bhyts.length }})
      <q-btn
        rounded
        color="primary"
        @click="copyTextToClipboard()"
        icon="content_copy"
      />
      </ListHeader
    >
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="dongBoDuLieu(searchText)"
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
import { mapGetters, mapActions } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
export default {
  components: { ThongTinTheBHYT, ListHeader },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
    ...mapGetters("bhyts", ["bhyts", "soDienThoais"]),
  },
  methods: {
    ...mapActions("bhyts", ["dongBoDuLieu"]),
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
  },
  mounted() {
    if (!localStorage.getItem("setIsLogin")) this.$router.push("/auth");
    if (this.$route.query.q) {
      this.searchText = this.$route.query.q;
      this.dongBoDuLieu(this.$route.query.q);
    }
  },
};
</script>
