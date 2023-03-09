<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Khách hàng lớn </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tìm kiếm theo thông tin thẻ BHYT"
        @keyup.enter="loadData()"
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
    <q-list v-for="donHang in dsDonHang" :key="donHang.id">
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ donHang.senderName }}
            <!-- <q-icon
              @click="xacNhanLoaiBo(evn)"
              :name="evn.soTien == 0 ? 'do_not_disturb_on' : 'delete_forever'"
              :color="evn.soTien == 0 ? 'red' : 'gray'"
            /> -->
          </q-item-label>
          <!-- <q-item-label caption lines="2">{{ evn.diaChi }}</q-item-label> -->
          <q-item-label caption lines="2">
            <a :href="`tel:${donHang.senderPhone}`">{{
              donHang.senderPhone
            }}</a>
          </q-item-label>
          <q-item-label caption lines="2">{{
            donHang.contentNote
          }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ donHang.ttNumber }}</q-item-label>
          <q-icon
            name="content_copy"
            @click="copyTextToClipboard(donHang.ttNumber)"
          />
          <q-item-label caption
            >Số tiền:
            {{
              parseInt(donHang.totalFeeSpecial).toLocaleString()
            }}</q-item-label
          >
          <q-item-label caption>{{
            new Date(donHang.updatedDate).toLocaleString()
          }}</q-item-label>
        </q-item-section></q-item
      >
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
  name: "KHLPage",
  data() {
    return {
      searchText: "",
      tokenFe: "",
      dsDonHang: [],
    };
  },
  methods: {
    sleep() {
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    async login() {
      var data = JSON.stringify({
        username: "142010_THAMHT",
        password: "Abc@123456789",
        ip: "",
        random: 0.8677049060452371,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-portalkhl.vnpost.vn/api/auth/signinKhl",
        headers: {
          capikey: "19001235",
          "Content-Type": "application/json",
        },
        data: data,
      };

      const {
        data: { tokenFe },
      } = await axios.post(
        "https://api-portalkhl.vnpost.vn/api/auth/signinKhl",
        data,
        config
      );
      this.tokenFe = tokenFe;
    },

    async loadData() {
      if (!this.tokenFe) await this.login();

      const homNay = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/");
      var data = JSON.stringify({
        orgCode: "142010",
        tuNgay: "01/03/2023",
        denNgay: homNay,
        pageNum: 0,
        pageSize: 500,
        sourceSystem: "KHL",
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-portalkhl.vnpost.vn/khl/getItemDtl",
        headers: {
          Authorization: `Bearer ${this.tokenFe}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const {
        data: [soDonHang, dsDonHang],
      } = await axios(config);
      for (let index = 0; index < soDonHang; index++) {
        const item = dsDonHang[index];
        await this.updateItem(item);
        await this.sleep();
      }
      this.dsDonHang = dsDonHang;
    },
    async updateItem({
      ttNumber,
      senderPhone,
      totalFeeSpecial,
      codAmount,
      updatedDate,
      createdDate,
    }) {
      axios.put(`https://192.168.1.7:2024/api/khls/${ttNumber}`, {
        soTien: totalFeeSpecial,
        ghiNo: codAmount,
        ten: senderPhone,
        updatedDate: updatedDate.toString().slice(0, 10),
        createdDate: createdDate.toString().slice(0, 10),
      });
    },
    copyTextToClipboard(ttNumber) {
      navigator.clipboard
        .writeText(
          `Để theo dõi định vị bưu gửi https://www.hotham.vn/tra-cuu-hang-buu-dien?q=${ttNumber}. (Bạn chỉ cần bấm vào link)`
        )
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
    this.loadData();
  },
});
</script>
