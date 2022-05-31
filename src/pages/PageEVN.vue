<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách Khách hàng EVN
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
    <q-list v-for="evn in evns" :key="evn.id">
      <q-item>
        <q-item-section>
          <q-item-label>{{ evn.ten }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.diaChi }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.soDienThoai }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.ghiChu }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ evn.ma }}</q-item-label>
          <q-icon
            name="content_copy"
            @click="copyTextToClipboard(evn.ma)"
          /> 
          <q-item-label caption>{{ evn.soTien }}</q-item-label>
          <q-item-label caption>{{ evn.updated_at }}</q-item-label>
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
  name: "EVNPage",
  data() {
    return {
      searchText: "",
      evns: [],
    };
  },
  methods: {
    async timKiem() {
      const { data } = await axios.get(
        `https://evn-buudienxatulap.herokuapp.com/api/evns?name=${this.searchText}`
      );
      this.evns = data;
    },
    copyTextToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        function () {
          Notify.create({
            type: "positive",
            message: `Bạn đã sao chép: ${text}`,
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
  },
  mounted() {
    // this.timKiem();
  },
});
</script>
