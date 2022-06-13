<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách KHL
      <q-btn
        rounded
        color="primary"
        @click="copySoDienThoaiToClipboard()"
        icon="content_copy"
      />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tìm kiếm theo thông tin thẻ BHYT"
        @keyup.enter="timKiem"
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
    <q-list v-for="khl in khls" :key="khl.id">
      <q-item>
        <q-item-section>
          <q-item-label>{{ khl.ten }}</q-item-label>
          <q-item-label caption lines="2">{{ khl.diaChi }}</q-item-label>
          <q-item-label caption lines="2">
            <a target="_blank" :href="`https://zalo.me/${khl.soDienThoai}`">{{ khl.soDienThoai }}</a>
          </q-item-label>
          <q-item-label caption lines="2">{{ khl.ghiChu }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ new Date(khl.updated_at).toLocaleString() }}</q-item-label>
          </q-item-section
      ></q-item>
      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "KhlPage",
  data() {
    return {
      searchText: "",
      khls: []
    };
  },
  methods: {
    async timKiem() {
      const { data } = await axios.get(
        `https://evn-buudienxatulap.herokuapp.com/api/khl?name=${this.searchText}`
      );
      this.khls = data;
    },
    copySoDienThoaiToClipboard() {
      navigator.clipboard
        .writeText([...new Set(this.evns.map(e => e.soDienThoai))].join())
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
    async loadData(){
        const { data } = await axios.get(
                'https://evn-buudienxatulap.herokuapp.com/api/khl'
            );
        this.khls = data;
    }
  },
  mounted(){
    this.loadData();
  }
});
</script>
