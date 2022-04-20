<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4">Phát sinh thẻ BHYT</ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="taiTuc(searchText)"
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
import { Loading, QSpinnerIos } from "quasar";
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
    ...mapGetters("bhyts", ["bhyts"]),
  },
  methods: {
    ...mapActions("bhyts", ["getAllBhyts", "taiTuc"]),
  },
  async mounted() {
    if (this.$route.query.q) {
      this.searchText = this.$route.query.q;
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      await this.taiTuc(this.$route.query.q);
      Loading.hide();
    }
  },
};
</script>
