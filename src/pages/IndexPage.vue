<template>
  <div class="q-pa-md">
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ bhyt.hoTen }} {{ bhyt.ngaySinhDt }}
            <q-icon
              :class="bhyt.gioiTinh == 1 ? 'text-pink' : 'text-primary'"
              :name="bhyt.gioiTinh == 1 ? 'female' : 'male'"
          /></q-item-label>
          <q-item-label caption lines="2">{{ bhyt.soTheBhyt }}</q-item-label>
          <q-item-label caption lines="2"
            >5 năm:{{ bhyt.ngay5Nam }}</q-item-label
          >
          <q-item-label caption lines="2">
            <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ bhyt.denNgayDt }}</q-item-label>
          <q-icon
            name="star"
            :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";

export default defineComponent({
  name: "IndexPage",
  methods: {
    ...mapActions("bhyts", ["getAllBhyts"]),
    loadData(startDate, endDate, name, completed = 0, page) {
      this.getAllBhyts({
        page,
        startDate,
        endDate,
        name,
        completed,
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
