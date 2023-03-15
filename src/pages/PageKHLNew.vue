<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >KHL cước {{ (doanhThu - tongCuocDaThanhToan).toLocaleString() }}đ : {{ tongCuocDaThanhToan.toLocaleString() }}đ / {{ doanhThu.toLocaleString() }}đ /
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
        hint="Tháng tra cứu"
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
      <!-- <q-input v-model="ngayLamViec" label="Ngày làm việc" mask="date" :rules="['date']" :dense="dense">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="ngayLamViec">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Đóng" color="primary" flat  :dense="dense"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input> -->
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
          <q-icon
            name="access_time"
            @click="showKHL(khl.senderPhone)"
          />
          <q-item-label caption
            >COD: {{ parseInt(khl.tongCOD).toLocaleString() }}</q-item-label
          >
          <q-item-label caption
            >Cước: {{ parseInt(khl.tongCuoc).toLocaleString() }}</q-item-label
          >
          <q-item-label caption
            >Đã trừ cước: {{ tongSoTienBuTruCongNoDaTru(khl.senderPhone) }}</q-item-label
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

    <q-dialog
    v-model="showDialog"
      full-height
    >
      <q-card class="column full-height" >
        <q-card-section>
          <div class="text-h6">{{ khl.hoTen }} - {{ khl.soDienThoai }}</div>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-input v-model="khl.hoTen" label="Họ và tên"/>
          <q-input v-model="khl.maCRM" label="Mã CRM">
            <template v-slot:append>
              <q-icon name="content_copy" @click="copyTextDienThoaiToClipboard(khl.maCRM)" />
            </template>
          </q-input>
          <q-input v-model="khl.hopDong" label="Hợp đồng DVBC"/>         
           <q-input v-model="khl.ngayHopDong" label="Ngày hợp đồng" mask="date" :rules="['date']" :dense="dense">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="khl.ngayHopDong">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Đóng" color="primary" flat  :dense="dense"/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="khl.tenNguoiHuong" label="Tên người hưởng" :dense="dense"/>
          <q-input v-model="khl.soTaiKhoanNganHang" label="Số tài khoản ngân hàng" :dense="dense"/>
          <q-input v-model="khl.tenNganHang" label="Tên ngân hàng" :dense="dense"/>
          <q-input v-model="khl.soTienBuTruCongNo" label="Số tiền trừ công nợ" :dense="dense" />
          <q-input v-model="khl.soTienCODvePaypost" label="Số tiền COD về Paypost" :dense="dense">
            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="updateKHL(khl)" />
            </template>
          </q-input>
          
        </q-card-section>

        <!-- <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions> -->
      </q-card>
    </q-dialog>

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
      ngayLamViec: [nam, thang, ngay].join("/"),
      showDialog: false,
      ngay,
      thang,
      nam,
      searchText: [thang, nam].join("/"),
      tokenFe: "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJKRmNhcC1XZWJBcGkiLCJleHAiOjE2NzkzOTM2MTQsIm5iZiI6MTY3ODc4ODUxNCwiaWF0IjoxNjc4Nzg4NTE0LCJhaWQiOiJLSEwiLCJ1aWQiOiIxNDIwMTBfVEhBTUhUIiwidWZuIjoiSOG7kyBUaOG7iyBUaOG6r20iLCJvcmciOiIxNDIwMTAiLCJvcmdFbXBsIjoiMTQyMDEwIiwiZGlkIjoiZWRkNjJlZWFhZGVjYjBiNjM1NDI4ODY3YjJlZDEwMGIiLCJsY3AiOjE2MzU4MTY3NDIwMDAsImV4cGlyYXRpb25EYXRlIjo5MH0.pEQagaUmtO98vcaJu9v4ZAgCKJoPN0v98ctFIUliZnsVMl7eYYqxY1xbXUuGr6JbIf5So-a52LEEp8MGqBd_VA",
      dsDonHang: [],
      khls: [],
      tongSoBuuGui: 0,
      doanhThu: 0,
      tongCuocDaThanhToan: 0,
      khl: {
        hoTen: "Nguyễn Văn Thìn",
        soDienThoai: "0978333963",
        hopDong: "Mlinh-191022-622000",
        ngayHopDong: "2022/10/19",
        soTienCODvePaypost: 4000000,
        soTienBuTruCongNo: 77500,
        tenNguoiHuong: "Nguyễn Văn Thìn",
        soTaiKhoanNganHang: "1618081988",
        tenNganHang: "MB",
        maCRM: "14200A04000622000"
      },
      cods: [],
      allCods: []
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
      // var data = JSON.stringify({
      //   orgCode: "142010",
      //   tuNgay: [1, parseInt(this.thang), this.nam].join("/"),
      //   denNgay: [1, parseInt(this.thang), this.nam].join("/"),
      //   pageNum: 0,
      //   pageSize: 5000,
      //   sourceSystem: "KHL",
      // });

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

    async tongSoTienBuTruCongNo(senderPhone) {
      const tinh = await this.tongCuoc(await this.findItems(senderPhone))
       - this.cods.reduce(
        (previousValue, { soTienBuTruCongNo }) =>
          previousValue + parseInt(soTienBuTruCongNo),
        0
      );
      return parseInt(tinh).toLocaleString();
    },
    tongSoTienBuTruCongNoDaTru(senderPhone) {
      const tinh = this.allCods.filter(c => c.soDienThoai == senderPhone).reduce(
        (previousValue, { soTienBuTruCongNo }) =>
          previousValue + parseInt(soTienBuTruCongNo),
        0
      );
      // console.log(senderPhone, tinh)
      return parseInt(tinh).toLocaleString();
    },

    async updateKHL({soDienThoai, hoTen, hopDong, ngayHopDong,tenNguoiHuong, soTaiKhoanNganHang, tenNganHang, maCRM, soTienCODvePaypost, soTienBuTruCongNo}) {
      
      await axios.post("https://192.168.1.7:2024/api/cods", {
        soDienThoai,
        hoTen,
        hopDong,
        ngayHopDong,
        tenNguoiHuong,
        soTaiKhoanNganHang,
        tenNganHang,
        maCRM,
        soTienCODvePaypost: soTienCODvePaypost.replaceAll(".",""),
        soTienBuTruCongNo: soTienBuTruCongNo.replaceAll(".",""),
        ngayLamViec: this.ngayLamViec,
      });

      await axios.put(`https://192.168.1.7:2024/api/khls/${soDienThoai}`, {
        hoTen,
        hopDong,
        ngayHopDong,
        tenNguoiHuong,
        soTaiKhoanNganHang,
        tenNganHang,
        maCRM,
      });
      this.showDialog = false;
    },

    async loadKHL(soDienThoai){
      const {data} = await axios.get(`https://192.168.1.7:2024/api/khls/${soDienThoai}`);
      this.khl = data
    },
    async loadCods(soDienThoai){
      const {data} = await axios.get(`https://192.168.1.7:2024/api/cods?name=${soDienThoai}`);
      this.cods = data
    },
    async loadAllCods(){
      const {data} = await axios.get("https://192.168.1.7:2024/api/cods");
      this.allCods = data
      this.tongCuocDaThanhToan = this.allCods.reduce(
        (previousValue, { soTienBuTruCongNo }) =>
          previousValue + parseInt(soTienBuTruCongNo),
        0
      );
    },
    async showKHL(soDienThoai) {
      // const [nam,thang,ngay] = this.ngayLamViec.split("/");
      // console.log(new Date(nam, thang, ngay).toISOString().slice(0,10))
      await this.loadCods(soDienThoai);
      await this.loadKHL(soDienThoai);
      
      this.khl.soTienBuTruCongNo = await this.tongSoTienBuTruCongNo(soDienThoai);
      const findCod = this.cods.find(c => c.soDienThoai === soDienThoai && new Date(c.ngayLamViec).toISOString().slice(0,10) === new Date().toISOString().slice(0,10))
      if(findCod) this.khl.soTienCODvePaypost = parseInt(findCod.soTienCODvePaypost).toLocaleString();
      // if(findCod) console.log(findCod)
      this.showDialog = true;
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
    copyTextDienThoaiToClipboard(text) {
      navigator.clipboard
        .writeText(text)
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
    async khoiTao(){
      await this.loadAllCods();
      await this.loadData();
    }
  },
  mounted() {
    this.khoiTao();
  },
});
</script>
