<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >KHL {{ searchText }} {{ doanhThu.toLocaleString() }}đ /
      {{ tongSoBuuGui }} bưu gửi
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
        @keyup.enter="traCuu()"
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
    <q-list
      v-for="khl in khls
        // .filter((t) => t.tongCOD)
        .sort(function (a, b) {
          return b.soLuong - a.soLuong;
        })"
      :key="khl.senderPhone"
    >
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ khl.senderName }}
            <!-- <q-icon
              @click="xacNhanLoaiBo(evn)"
              :name="evn.soTien == 0 ? 'do_not_disturb_on' : 'delete_forever'"
              :color="evn.soTien == 0 ? 'red' : 'gray'"
            /> -->
          </q-item-label>
          <!-- <q-item-label caption lines="2">{{ evn.diaChi }}</q-item-label> -->
          <q-item-label caption lines="2">
            <a :href="`tel:${khl.senderPhone}`">{{ khl.senderPhone }}</a>
          </q-item-label>
          <q-item-label caption lines="2">{{ khl.senderAdd }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ khl.soLuong }}</q-item-label>
          <!-- <q-icon
            name="content_copy"
            @click="copyTextToClipboard(donHang.ttNumber)"
          /> -->
          <q-item-label caption
            >COD: {{ parseInt(khl.tongCOD).toLocaleString() }}</q-item-label
          >
          <q-item-label caption
            >Cước: {{ parseInt(khl.tongCuoc).toLocaleString() }}</q-item-label
          >
          <!-- <q-item-label caption>{{
            new Date(donHang.updatedDate).toLocaleString()
          }}</q-item-label> -->
        </q-item-section></q-item
      >
      <q-separator spaced inset />
    </q-list>
    <!-- <q-list v-for="donHang in dsDonHang" :key="donHang.id">
      <q-item>
        <q-item-section>
          <q-item-label
            >{{ donHang.senderName }}
          </q-item-label>
          
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
    </q-list> -->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "KHLPage",
  data() {
    const [nam, thang, ngay] = new Date().toISOString().slice(0, 10).split("-");
    return {
      ngay,
      thang,
      nam,
      searchText: [thang, nam].join("/"),
      tokenFe:
        "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJKRmNhcC1XZWJBcGkiLCJleHAiOjE2NzkwMTQ0MTcsIm5iZiI6MTY3ODQwOTMxNywiaWF0IjoxNjc4NDA5MzE3LCJhaWQiOiJLSEwiLCJ1aWQiOiIxNDIwMTBfVEhBTUhUIiwidWZuIjoiSOG7kyBUaOG7iyBUaOG6r20iLCJvcmciOiIxNDIwMTAiLCJvcmdFbXBsIjoiMTQyMDEwIiwiZGlkIjoiZWRkNjJlZWFhZGVjYjBiNjM1NDI4ODY3YjJlZDEwMGIiLCJsY3AiOjE2MzU4MTY3NDIwMDAsImV4cGlyYXRpb25EYXRlIjo5MH0.snnuvZdWzP94_9baQfbJITD_OiGA2gyVl1EJiPVX7x-nL7ej2jGmnNWSt7-G7x4h32zxz4rLe9SZtJP3OzRFsw",
      dsDonHang: [],
      khls: [],
      tongSoBuuGui: 0,
      doanhThu: 0,
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
      this.dsDonHang = [];
      if (!this.tokenFe) await this.login();
      var data = JSON.stringify({
        orgCode: "142010",
        tuNgay: [1, parseInt(this.thang), this.nam].join("/"),
        denNgay: new Date(this.nam, parseInt(this.thang), 1)
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/"),
        pageNum: 0,
        pageSize: 5000,
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

      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });

      const {
        data: [tongSoBuuGui, dsDonHang],
      } = await axios(config);

      this.tongSoBuuGui = tongSoBuuGui;
      this.doanhThu = dsDonHang.reduce(
        (previousValue, { totalFeeSpecial }) =>
          previousValue + parseInt(totalFeeSpecial),
        0
      );
      Loading.hide();

      this.dsDonHang = dsDonHang;

      const uniqueKhls = new Map();

      const mapKhls = dsDonHang.map(
        ({ senderPhone, senderName, senderAdd }) => ({
          senderPhone,
          senderName,
          senderAdd,
        })
      );

      for (let index = 0; index < mapKhls.length; index++) {
        const item = mapKhls[index];
        if (!uniqueKhls.has(item.senderPhone)) {
          const items = dsDonHang.filter(
            (t) => t.senderPhone === item.senderPhone
          );
          uniqueKhls.set(item.senderPhone, {
            ...item,
            soLuong: items.length,
            tongCuoc: items.reduce(
              (previousValue, { totalFeeSpecial }) =>
                previousValue + parseInt(totalFeeSpecial),
              0
            ),
            tongCOD: items
              .filter((t) => t.codAmount)
              .reduce(
                (previousValue, { codAmount }) =>
                  previousValue + parseInt(codAmount),
                0
              ),
          });
        }
      }

      this.khls = [...uniqueKhls.values()];
      // console.log(this.khls);
      // for (let index = 0; index < soDonHang; index++) {
      //   const item = dsDonHang[index];
      //   await this.updateItem(item);
      //   await this.sleep();
      // }
      //
    },

    async traCuu() {
      const [thang, nam] = this.searchText.split("/");
      this.thang = thang;
      this.nam = nam;
      this.loadData();
    },

    async findItems(senderPhone) {
      return this.dsDonHang.filter((item) => item.senderPhone === senderPhone);
    },

    async tongCuoc(items) {
      return items.reduce(
        (previousValue, { totalFeeSpecial }) =>
          previousValue + parseInt(totalFeeSpecial),
        0
      );
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
    copySoDienThoaiToClipboard() {
      navigator.clipboard
        .writeText(this.khls.map((t) => t.senderPhone).join())
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
