<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Gửi đồ qua bưu điện </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tìm kiếm thông tin đơn hàng"
        @keyup.enter="timKiem(searchText)"
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
    <q-list v-for="don in dons" :key="don.id">
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ don.contentNote }}
            <!-- <q-icon
              @click="xacNhanLoaiBo(evn)"
              :name="evn.soTien == 0 ? 'do_not_disturb_on' : 'delete_forever'"
              :color="evn.soTien == 0 ? 'red' : 'gray'"
            /> -->
          </q-item-label>
          <q-item-label caption lines="2">{{ don.recName }}</q-item-label>
          <q-item-label caption lines="2">{{ don.recPhone }}</q-item-label>
          <q-item-label caption lines="2">{{ don.recAdd }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ don.senderName }}</q-item-label>
          <q-item-label caption>{{ don.senderPhone }}</q-item-label>
          <q-item-label caption>{{ don.senderAdd }}</q-item-label>
          <q-item-label caption>{{
            new Date(don.updated_at).toLocaleString()
          }}</q-item-label>
        </q-item-section></q-item
      >
      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import axios from "axios";

export default defineComponent({
  components: { ListHeader },
  name: "EVNPage",
  data() {
    return {
      searchText: "",
      dons: [],
    };
  },
  methods: {},
  async mounted() {
    const { data } = await axios.get("https://app.hotham.vn/api/dons");
    this.dons = data;
  },
});
</script>
