<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4"
      >KHL {{ doanhThu.toLocaleString() }}đ / {{ tongSoBuuGui }} bưu gửi
      <q-btn
        rounded
        color="primary"
        @click="copySoDienThoaiToClipboard()"
        icon="content_copy"
      />
      <q-btn
        rounded
        color="primary"
        @click="copyChiCODToClipboard()"
        icon="done_all"
      />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        :hint="`Cước còn: ${(
          doanhThu - tongCuocDaThanhToan
        ).toLocaleString()}đ / đã trừ: ${tongCuocDaThanhToan.toLocaleString()}đ / `"
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
      <!-- {{ (doanhThu - tongCuocDaThanhToan).toLocaleString() }}đ : {{ tongCuocDaThanhToan.toLocaleString() }}đ /  -->
    </div>
    <q-list>
      <div
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
            <q-item-label caption
              ><q-icon
                name="info"
                @click="showItems(khl.senderPhone)"
                class="cursor-pointer" />
              <q-badge color="teal" :label="khl.soLuong"
            /></q-item-label>
            <q-icon name="access_time" @click="showKHL(khl.senderPhone)" />
            <q-item-label caption
              ><strong
                >COD:
                {{
                  parseInt(khl.tongCOD - khl.soTienDaChiCOD).toLocaleString()
                }}</strong
              >
              <span class="text-strike">{{
                parseInt(khl.tongCOD).toLocaleString()
              }}</span></q-item-label
            >
            <q-item-label caption
              ><strong class="text-bold"
                >Còn nợ:
                {{
                  parseInt(
                    khl.tongCuoc - khl.soTienDaTruCongNo
                  ).toLocaleString()
                }}</strong
              >
              <span class="text-strike">{{
                parseInt(khl.soTienDaTruCongNo).toLocaleString()
              }}</span></q-item-label
            >

            <q-item-label caption
              >Tổng cước:
              {{ parseInt(khl.tongCuoc).toLocaleString() }}</q-item-label
            >
            <!-- <q-item-label caption>{{
            new Date(donHang.updatedDate).toLocaleString()
          }}</q-item-label> -->
          </q-item-section></q-item
        >
        <q-separator spaced inset />
      </div>
    </q-list>

    <q-dialog v-model="showSelectedItems" full-height>
      <q-card class="column full-height">
        <q-card-section>
          <div class="text-h6">
            {{ khl.hoTen }} <q-badge :label="selectItems.length" />
          </div>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-list bordered>
            <div
              v-for="cod in this.allCods.filter(
                (c) => c.soDienThoai == khl.soDienThoai
              )"
              :key="cod.id"
            >
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="paid" />
                </q-item-section>
                <q-item-section>
                  <q-item-label overline>{{ cod.tenNguoiHuong }}</q-item-label>
                  <q-item-label
                    >{{ cod.soTaiKhoanNganHang }}-{{
                      cod.tenNganHang
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >Đã chi:
                    {{
                      parseInt(
                        cod.soTienCODvePaypost - cod.soTienBuTruCongNo
                      ).toLocaleString()
                    }}</q-item-label
                  >
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ cod.ngayLamViec }}</q-item-label>
                  <q-item-label caption
                    >COD:
                    {{
                      parseInt(cod.soTienCODvePaypost).toLocaleString()
                    }}</q-item-label
                  >
                  <q-item-label caption
                    >Cước:{{
                      parseInt(cod.soTienBuTruCongNo).toLocaleString()
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </div>
            <q-separator spaced inset="item" />
            <div v-for="donHang in selectItems" :key="donHang.id">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ donHang.senderName }} </q-item-label>

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
            </div>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDialog" full-height>
      <q-card class="column full-height">
        <q-card-section>
          <div class="text-h6">{{ khl.hoTen }} - {{ khl.soDienThoai }}</div>
        </q-card-section>

        <q-card-section class="col q-pt-none">
          <q-input v-model="khl.hoTen" label="Họ và tên" />
          <q-input v-model="khl.maCRM" label="Mã CRM">
            <template v-slot:append>
              <q-icon
                name="content_copy"
                @click="copyTextDienThoaiToClipboard(khl.maCRM)"
              />
            </template>
          </q-input>
          <q-input v-model="khl.hopDong" label="Hợp đồng DVBC" />
          <q-input
            v-model="khl.ngayHopDong"
            label="Ngày hợp đồng"
            mask="date"
            :rules="['date']"
            :dense="dense"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="khl.ngayHopDong">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Đóng"
                        color="primary"
                        flat
                        :dense="dense"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="khl.tenNguoiHuong"
            label="Tên người hưởng"
            :dense="dense"
          />
          <q-input
            v-model="khl.soTaiKhoanNganHang"
            label="Số tài khoản ngân hàng"
            :dense="dense"
          />
          <q-input
            v-model="khl.tenNganHang"
            label="Tên ngân hàng"
            :dense="dense"
          />
          <q-input
            v-model="khl.soTienBuTruCongNo"
            label="Số tiền trừ công nợ"
            :dense="dense"
          />
          <q-input
            v-model="khl.soTienCODvePaypost"
            label="Số tiền COD về Paypost"
            :dense="dense"
          >
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
import { Notify } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "KHLPage",
  data() {
    const [nam, thang, ngay] = new Date().toISOString().slice(0, 10).split("-");
    return {
      ngayLamViec: [nam, thang, ngay].join("/"),
      showDialog: false,
      showSelectedItems: false,
      ngay,
      thang,
      nam,
      searchText: [thang, nam].join("/"),
      tokenFe: "",
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
        soTienDaTruCongNo: 0,
        tenNguoiHuong: "Nguyễn Văn Thìn",
        soTaiKhoanNganHang: "1618081988",
        tenNganHang: "MB",
        maCRM: "14200A04000622000",
      },
      selectItems: [],
      cods: [],
      allCods: [],
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

    async loadData(thangTruoc = 0) {
      this.dsDonHang = [];
      if (!this.tokenFe) await this.login();
      var data = JSON.stringify({
        orgCode: "142010",
        tuNgay: [1, parseInt(this.thang - thangTruoc || 12), this.nam].join(
          "/"
        ),
        denNgay: new Date(this.nam, parseInt(this.thang - thangTruoc), 1)
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

      const {
        data: [tongSoBuuGui, dsDonHang],
      } = await axios(config);

      this.tongSoBuuGui = tongSoBuuGui;
      this.doanhThu = dsDonHang.reduce(
        (previousValue, { totalFeeSpecial }) =>
          previousValue + parseInt(totalFeeSpecial),
        0
      );

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
            soTienDaTruCongNo: this.tongSoTienBuTruCongNoDaTru(
              item.senderPhone
            ),
            soTienDaChiCOD: this.tongSoTienDaChiCOD(item.senderPhone),
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
      const tinh =
        (await this.tongCuoc(await this.findItems(senderPhone))) -
        this.cods.reduce(
          (previousValue, { soTienBuTruCongNo }) =>
            previousValue + parseInt(soTienBuTruCongNo),
          0
        );
      return parseInt(tinh).toLocaleString();
    },
    tongSoTienBuTruCongNoDaTru(senderPhone) {
      const tinh = this.allCods
        .filter((c) => c.soDienThoai == senderPhone)
        .reduce(
          (previousValue, { soTienBuTruCongNo }) =>
            previousValue + parseInt(soTienBuTruCongNo),
          0
        );
      return tinh;
    },
    tongSoTienDaChiCOD(senderPhone) {
      const tinh = this.allCods
        .filter((c) => c.soDienThoai == senderPhone)
        .reduce(
          (previousValue, { soTienCODvePaypost }) =>
            previousValue + parseInt(soTienCODvePaypost),
          0
        );
      return tinh;
    },

    async updateKHL({
      soDienThoai,
      hoTen,
      hopDong,
      ngayHopDong,
      tenNguoiHuong,
      soTaiKhoanNganHang,
      tenNganHang,
      maCRM,
      soTienCODvePaypost,
      soTienBuTruCongNo,
    }) {
      try {
        const { data } = await this.$api.post(
          "https://app.hotham.vn/api/cods",
          {
            soDienThoai,
            hoTen,
            hopDong,
            ngayHopDong,
            tenNguoiHuong,
            soTaiKhoanNganHang,
            tenNganHang,
            maCRM,
            soTienCODvePaypost: soTienCODvePaypost.replaceAll(".", ""),
            soTienBuTruCongNo: soTienBuTruCongNo.replaceAll(".", ""),
            ngayLamViec: this.ngayLamViec,
          }
        );
        const findCod = this.cods.find(
          (c) =>
            c.soDienThoai === soDienThoai &&
            new Date(c.ngayLamViec).toISOString().slice(0, 10) ===
              new Date().toISOString().slice(0, 10)
        );
        if (findCod) Object.assign(findCod, data);
        else this.allCods.push(data);
        await this.$api.put(`https://app.hotham.vn/api/khls/${soDienThoai}`, {
          hoTen,
          hopDong,
          ngayHopDong,
          tenNguoiHuong,
          soTaiKhoanNganHang,
          tenNganHang,
          maCRM,
        });
        this.showDialog = false;
        Notify.create({
          type: "positive",
          message: `Đã ghi nhận thành công!`,
        });
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Không lưu được thông tin khách hàng!" + err,
        });
      }
    },

    async loadKHL(soDienThoai) {
      try {
        const { data } = await this.$api.get(
          `https://app.hotham.vn/api/khls/${soDienThoai}`
        );
        this.khl = data;
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Lỗi hệ thống!" + err,
        });
      }
    },
    async loadCods(soDienThoai) {
      try {
        const { data } = await this.$api.get(
          `https://app.hotham.vn/api/cods?name=${soDienThoai}`
        );
        this.cods = data;
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Lỗi hệ thống!" + err,
        });
      }
    },
    async loadAllCods() {
      const { data } = await this.$api.get("https://app.hotham.vn/api/cods");
      this.allCods = data;
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

      this.khl.soTienBuTruCongNo = await this.tongSoTienBuTruCongNo(
        soDienThoai
      );
      const findCod = this.cods.find(
        (c) =>
          c.soDienThoai === soDienThoai &&
          new Date(c.ngayLamViec).toISOString().slice(0, 10) ===
            new Date().toISOString().slice(0, 10)
      );
      if (findCod) {
        this.khl.soTienCODvePaypost = parseInt(
          findCod.soTienCODvePaypost
        ).toLocaleString();
        this.khl.soTienBuTruCongNo = parseInt(
          findCod.soTienBuTruCongNo
        ).toLocaleString();
      }
      // if(findCod) console.log(findCod)
      this.showDialog = true;
    },
    async showItems(senderPhone) {
      await this.loadKHL(senderPhone);
      this.selectItems = this.dsDonHang.filter(
        (i) => i.senderPhone === senderPhone
      );
      this.showSelectedItems = true;
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
      navigator.clipboard.writeText(text).then(
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
    async copyChiCODToClipboard() {
      await this.loadAllCods();
      navigator.clipboard
        .writeText(
          `${this.allCods
            .filter(
              (c) =>
                new Date(c.ngayLamViec).toISOString().slice(0, 10) ===
                new Date().toISOString().slice(0, 10)
            )
            .map(
              ({
                hoTen,
                hopDong,
                ngayHopDong,
                soTienCODvePaypost,
                soTienBuTruCongNo,
                tenNguoiHuong,
                soTaiKhoanNganHang,
                tenNganHang,
                maCRM,
              }) =>
                [
                  hoTen,
                  hopDong,
                  ngayHopDong,
                  soTienCODvePaypost,
                  soTienBuTruCongNo,
                  soTienCODvePaypost - soTienBuTruCongNo,
                  tenNguoiHuong,
                  soTaiKhoanNganHang,
                  tenNganHang,
                  ,
                  maCRM,
                ].join("\t")
            )
            .join("\r\n")}
`
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
    async khoiTao() {
      await this.loadAllCods();
      if (this.ngay < 3) {
        await this.loadData(1);
        this.searchText = [this.thang - 1 || 12, this.nam].join("/");
      } else await this.loadData();
    },
  },
  mounted() {
    this.khoiTao();
  },
});
</script>
