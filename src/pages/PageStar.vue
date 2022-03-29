<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách thẻ BHYT đánh dấu</ListHeader>
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
  methods: {
    ...mapActions("bhyts", ["getAllBhyts"]),
    loadData() {
      this.getAllBhyts({
        completed: 1,
      });
    },
  },

  computed: {
    ...mapGetters("bhyts", ["bhyts"]),
  },

  mounted() {
    this.loadData();
  },
});
</script>
