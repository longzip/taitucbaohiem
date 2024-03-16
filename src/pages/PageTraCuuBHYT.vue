<template>
  <q-page class="">
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Tra cứu {{ bhyts.length }}/{{
            parseInt(tongTien).toLocaleString()
          }}đ!<br />(Hạn sử dụng: {{ userDetails?.hetHan }})
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="loadBhytByUserName()" v-close-popup>
              <q-item-section>Đã thu tiền</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByUserName(1)" v-close-popup>
              <q-item-section>Đã thu tiền BHYT</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByUserName(0)" v-close-popup>
              <q-item-section>Đã thu tiền BHXH</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByNamSinh" v-close-popup>
              <q-item-section>Tìm theo năm sinh</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByName" v-close-popup>
              <q-item-section>Tìm tất cả</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhyts({ thang: 1 })" v-close-popup>
              <q-item-section>Tái tục 1 tháng</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhyts({ thang: 2 })" v-close-popup>
              <q-item-section>Tái tục 2 tháng</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  isBHXHTN: 1,
                  taiTucBHXH: 1,
                  completed: '0',
                  disabled: '0',
                  userName: userDetails.id,
                })
              "
              v-close-popup
            >
              <q-item-section>Tái tục BHXH TN 1 tháng</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  isBHXHTN: 1,
                  userName: userDetails.id,
                })
              "
              v-close-popup
            >
              <q-item-section>Tái tục BHXH All</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  isBHXHTN: 1,
                  maXa: userDetails.maXa,
                })
              "
              v-close-popup
            >
              <q-item-section>Tái tục BHXH TN (All)</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsHetHan" v-close-popup>
              <q-item-section>Đã hết hạn</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsDisable" v-close-popup>
              <q-item-section>Đã liên hệ</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytsCompleted" v-close-popup>
              <q-item-section>Đánh dấu sao</q-item-section>
            </q-item>
            <q-item clickable @click="loadBaoCaoChiTietGiaoDich" v-close-popup>
              <q-item-section>Báo cáo Chi Tiết Giao Dịch</q-item-section>
            </q-item>
            <q-item clickable @click="inC17" v-close-popup>
              <q-item-section>In C17</q-item-section>
            </q-item>
            <q-item clickable @click="printDanhSachTraThe" v-close-popup>
              <q-item-section>In Danh sách trả thẻ</q-item-section>
            </q-item>
            <q-item clickable @click="loadTaiTucBHXH" v-close-popup>
              <q-item-section>Tái tục BHXH</q-item-section>
            </q-item>
            <q-item clickable @click="copyMaSoBhxhToClipboard" v-close-popup>
              <q-item-section>Copy tất cả mã số BHXH</q-item-section>
            </q-item>
            <q-item clickable @click="copyHoTenToClipboard" v-close-popup>
              <q-item-section>Copy tất cả họ tên</q-item-section>
            </q-item>
            <q-item clickable @click="copySoDienThoaiToClipboard" v-close-popup>
              <q-item-section>Copy tất cả số điện thoại</q-item-section>
            </q-item>
            <q-item clickable @click="copyNamePhoneClipboard" v-close-popup>
              <q-item-section>Copy danh bạ</q-item-section>
            </q-item>
            <q-item clickable @click="batTatRemove" v-close-popup>
              <q-item-section>Tắt/Bật danh sách</q-item-section>
            </q-item>
            <q-item clickable @click="timMoi(searchText)" v-close-popup>
              <q-item-section>Tìm mới</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                resetBhyt(
                  searchText
                    ? bhyts.filter((bhyt) => bhyt.userName !== searchText)
                    : []
                )
              "
              v-close-popup
            >
              <q-item-section>Xóa danh sách</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                resetBhyt(
                  searchText
                    ? bhyts.filter((bhyt) => bhyt.userName === searchText)
                    : []
                )
              "
              v-close-popup
            >
              <q-item-section>Giữ lại danh sách</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-banner>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        ref="inputSearch"
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
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <ThongTinTheBHYT :bhyt="bhyt" />
      <q-separator spaced inset />
    </q-list>
  </q-page>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import axios from "axios";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import { Loading, QSpinnerIos, Notify } from "quasar";
export default {
  components: { ThongTinTheBHYT },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    ...mapGetters("bhyts", ["bhyts", "tongTien"]),
    ...mapState("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("bhyts", [
      "getBhyts",
      "resetBhyt",
      "traCuuBhyts",
      "updateBhyt",
      "hoSoDaXuLy",
      "dongBoDuLieu",
      "traCuuTheoTen",
      "getDanhSachKhachHangTaiTuc",
      "copyHoTenToClipboard",
      "batTatRemove",
    ]),
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async loadTaiTucBHXH() {
      this.getDanhSachKhachHangTaiTuc({
        filterItems: [],
        maxResultCount: 500,
        skipCount: 0,
        mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
        tuThang: "2023-03-01 00:00:00",
        denThang: "2023-04-01 00:00:00",
        type: -1,
        loaiDichVu: 0,
      });
    },

    async loadBaoCaoChiTietGiaoDich() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();

      if (this.searchText.split(" - ").length !== 2) {
        this.searchText = `${new Date(year, month - 2, 1)
          .toISOString()
          .slice(0, 10)} - ${new Date(2024, 12, 31)
          .toISOString()
          .slice(0, 10)}`;
      }

      const ngays = this.searchText.split(" - ");
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      try {
        await this.hoSoDaXuLy({
          tuNgay: ngays[0],
          denNgay: ngays[1],
          mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
        });
      } catch (error) {
        Notify.create({
          message: "Không thể kế nối đến máy chủ !",
          color: "red",
        });
      }

      Loading.hide();
    },
    async inC17() {
      const ds = new Map();
      for (let index = 1; index < 10; index++) {
        await ds.set(`${this.searchText}0${index}`, {
          tongTien: 0,
          tienBHYT: 0,
          tienBHXH: 0,
          soBienLai: `${this.searchText}0${index}`,
          ngayLap: null,
        });
      }
      for (let index = 10; index < 100; index++) {
        await ds.set(`${this.searchText}${index}`, {
          tongTien: 0,
          tienBHYT: 0,
          tienBHXH: 0,
          soBienLai: `${this.searchText}${index}`,
          ngayLap: null,
        });
      }
      await ds.set(`${parseInt(this.searchText + 99) + 1}`, {
        tongTien: 0,
        tienBHYT: 0,
        tienBHXH: 0,
        soBienLai: `${parseInt(this.searchText + 99) + 1}`,
        ngayLap: null,
      });
      const xuatc17 = await this.bhyts.filter((t) =>
        t.soBienLai.startsWith(this.searchText ?? "21871")
      );
      for (let index = 0; index < this.bhyts.length; index++) {
        const t = this.bhyts[index];
        if (t.userId === this.userDetails.id && ds.has(t.soBienLai)) {
          const g = ds.get(t.soBienLai);
          ds.set(t.soBienLai, {
            ...g,
            ngayLap: t.ngayLap,
            tienBHYT:
              t.maThuTuc === 1 ? parseInt(t.tongTien) + g.tienBHYT : g.tienBHYT,
            tienBHXH:
              t.maThuTuc === 0 ? parseInt(t.tongTien) + g.tienBHXH : g.tienBHXH,
            tongTien: parseInt(t.tongTien) + g.tongTien,
          });
        }
      }
      await this.sleep(1000);
      const res = await fetch(
        `https://app.hotham.vn/api/mau-c17-all/1/pdf?tienBHYT=${xuatc17
          .filter((t) => t.maThuTuc == 1)
          .map((t) => t.tongTien)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}&tienBHXH=${xuatc17
          .filter((t) => t.maThuTuc == 0)
          .map((t) => t.tongTien)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify([...ds.values()]),
        }
      );

      const blob = await res.blob();
      if (blob.errors) {
        console.error(blob.errors);
        throw new Error("Failed to fetch API");
      }

      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${new Date()
        .toISOString()
        .slice(0, 10)}-tham-tu-lap-c17.pdf`;
      link.click();
    },

    async print(maSoBhxhs) {
      let a = document.createElement("a");
      a.target = "_blank";
      let lienKet = `https://app.hotham.vn/mau-c17/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?maSoBhxhs=${maSoBhxhs}`;
      a.href = lienKet;
      a.click();
    },

    loadBhytByNamSinh() {
      this.getBhyts({
        completed: "0",
        disabled: "0",
        maXa: this.userDetails.maXa,
        nam: this.searchText,
      });
    },
    loadBhytByUserName(user) {
      if (user === 1) this.searchText = this.userDetails.maNhanVienThu;
      if (user === 0) this.searchText = "_" + this.userDetails.maNhanVienThu;
      if (!this.searchText) {
        Notify.create({
          type: "negative",
          message: "Nhập mã nhân viên thu",
        });
      }
      this.getBhyts({
        userName: this.searchText,
      });
    },
    loadBhytByName() {
      this.getBhyts({
        name: this.searchText,
      });
    },
    loadBhyts({ thang = 1 }) {
      this.getBhyts({
        thang,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        maXa: this.userDetails.maXa,
        name: this.searchText,
      });
    },
    loadBHXHTNs(data) {
      this.getBhyts({
        ...data,
        name: this.searchText,
      });
    },
    loadBhytsHetHan() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: "0",
        disabled: "0",
        hetHan: "1",
        name: this.searchText,
      });
    },
    loadBhytsDisable() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        disabled: 1,
      });
    },
    loadBhytsCompleted() {
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: 1,
        disabled: "0",
      });
    },
    async timKiem(searchText) {
      const thongSoTheBHYTs = searchText.split("|");
      if (thongSoTheBHYTs.length > 1) {
        this.searchText = searchText = thongSoTheBHYTs[0];
      }
      const danhSachTimKiem = searchText.split(",");
      if (danhSachTimKiem.length > 1)
        await this.traCuuBhyts({ searchText, maXa: this.userDetails.maXa });
      const regex = /[0-9]/g;
      for (let index = 0; index < danhSachTimKiem.length; index++) {
        const name = danhSachTimKiem[index]
          .split(" ")
          .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
          .join(" ");
        const maSo = name.match(regex);
        if (maSo) {
          await this.dongBoDuLieu(maSo.join(""));
          await this.sleep(500);
        } else {
          try {
            await this.traCuuTheoTen({
              name,
              maXa: this.userDetails.maXa,
              maHuyen: this.userDetails.maHuyen,
              maTinh: this.userDetails.maTinh,
            });
            if (this.bhyts.length > 50) this.resetBhyt([]);
          } catch (error) {
            Notify.create({
              type: "negative",
              message: "Không thực hiện được!" + error,
            });
          }
        }
      }

      this.$refs.inputSearch.select();
    },
    async timMoi(searchText) {
      const ds = searchText.split(",");
      const daDongBos = JSON.parse(localStorage.getItem("hoTens")) || [];
      const difference = ds.filter((x) => !daDongBos.includes(x));
      this.searchText = difference.join();
      this.timKiem(this.searchText);
    },
    async khoiTao() {
      this.resetBhyt([]);
      if (this.$route.query.key) {
        this.key = await this.saveBHYT(this.$route.query.key);
      }
    },
    async printDanhSachTraThe() {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = `https://app.hotham.vn/danh-sach-tra-the/1/pdf?maSoBhxhs=${this.bhyts
        .map((i) => i.maSoBhxh)
        .join(",")}`;
      a.click();
    },
    copyMaSoBhxhToClipboard() {
      navigator.clipboard
        .writeText(this.bhyts.map((bhyt) => bhyt.maSoBhxh))
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
        .writeText(
          [...new Set(this.bhyts.map((bhyt) => bhyt.soDienThoai))].join("\r\n")
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
    copyNamePhoneClipboard() {
      navigator.clipboard
        .writeText(
          "Name\tPhone\r\n" +
            [
              ...new Map(
                this.bhyts.map(({ soDienThoai, hoTen, ngaySinhDt }) => [
                  soDienThoai,
                  hoTen +
                    " " +
                    new Date(ngaySinhDt).getFullYear() +
                    "\t" +
                    soDienThoai,
                ])
              ).values(),
            ].join("\r\n")
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
};
</script>

<style>
.list-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
