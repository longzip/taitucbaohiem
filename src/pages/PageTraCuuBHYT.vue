<template>
  <q-page class="">
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Bấm vào đây để tra cứu thông tin <br />
          (Hạn sử dụng: {{ userDetails?.hetHan }})
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="loadBhytByName" v-close-popup>
              <q-item-section>Tìm tất cả</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByUserName(1)" v-close-popup>
              <q-item-section>Đã thu tiền BHYT</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByUserName(0)" v-close-popup>
              <q-item-section>Đã thu tiền BHXH</q-item-section>
            </q-item>
            <q-item clickable @click="taiTucBHYT1thang" v-close-popup>
              <q-item-section>Tái tục 1 tháng (Me)</q-item-section>
            </q-item>
            <q-item clickable @click="taiTucBHYT2thang" v-close-popup>
              <q-item-section>Tái tục 2 tháng (Me)</q-item-section>
            </q-item>

            <q-item clickable @click="loadBhyts({ thang: 1 })" v-close-popup>
              <q-item-section>Tái tục 1 tháng (All)</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhyts({ thang: 2 })" v-close-popup>
              <q-item-section>Tái tục 2 tháng (All)</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  tienNop: 1,
                  taiTucBHXH: 1,
                  disabled: '0',
                  completed: '0',
                  userName: userDetails.id,
                })
              "
              v-close-popup
            >
              <q-item-section>Tái tục BHXH (1 tháng)</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  tienNop: 1,
                  userName: userDetails.id,
                })
              "
              v-close-popup
            >
              <q-item-section>Tái tục BHXH (All)</q-item-section>
            </q-item>

            <q-item clickable @click="loadTaiTucBHYTBT" v-close-popup>
              <q-item-section>BHYT bổ trợ</q-item-section>
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
              <q-item-section>Lưu danh bạ</q-item-section>
            </q-item>
            <q-item clickable @click="batTatRemove" v-close-popup>
              <q-item-section>Tắt/Bật danh sách</q-item-section>
            </q-item>
            <q-item clickable @click="timMoi(searchText)" v-close-popup>
              <q-item-section>Tìm mới</q-item-section>
            </q-item>
            <q-item clickable @click="loadBhytByNamSinh" v-close-popup>
              <q-item-section>Tìm theo năm sinh</q-item-section>
            </q-item>
            <q-item clickable @click="loadTaiTucBHYT" v-close-popup>
              <q-item-section>Tái tục BHYT (ssm)</q-item-section>
            </q-item>
            <q-item clickable @click="loadTaiTucBHXH" v-close-popup>
              <q-item-section>Tái tục BHXH (ssm)</q-item-section>
            </q-item>
            <q-item clickable @click="capNhatBHXHTN(searchText)" v-close-popup>
              <q-item-section>Đồng bộ BHXH TN</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                loadBHXHTNs({
                  tienNop: 1,
                  maXa: userDetails.maXa,
                })
              "
              v-close-popup
            >
              <q-item-section>Tìm BHXH</q-item-section>
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
            <q-item clickable @click="loadBhytByUserName()" v-close-popup>
              <q-item-section>Đã thu tiền</q-item-section>
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
    <q-list>
      <q-item-label header>
        Số lượng: <q-badge>{{ bhyts.length }}</q-badge
        >/Trung bình đóng:
        {{ parseInt(tongTienBHYT / (bhyts.length || 1)).toLocaleString() }}/Hoa
        hồng:
        {{
          parseInt(
            ((tongTienBHYT / (bhyts.length || 1)) * 0.0264).toFixed(0)
          ).toLocaleString()
        }}đ/thẻ<br />
        Tổng tiền:
        <q-badge>{{ parseInt(tongTienBHYT).toLocaleString() }}</q-badge> : Hoa
        hồng:
        {{ parseInt((tongTienBHYT * 0.0264).toFixed(0)).toLocaleString() }}đ
        <br />
        BHXHTN :
        <q-badge>{{ parseInt(tongTienBHXH).toLocaleString() }}</q-badge>
      </q-item-label>

      <div v-for="bhyt in bhyts" :key="bhyt.id">
        <ThongTinTheBHYT :bhyt="bhyt" />
        <q-separator spaced inset />
      </div>
    </q-list>
  </q-page>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import { Notify } from "quasar";
export default {
  components: { ThongTinTheBHYT },
  data() {
    return {
      searchText: "",
      tuNgayDenNgay: "",
      soBienLai: "",
    };
  },
  computed: {
    ...mapGetters("bhyts", ["bhyts", "tongTienBHYT", "tongTienBHXH"]),
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
      "capNhatBHXHTN",
    ]),
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    taiTucBHYT1thang() {
      this.searchText = this.userDetails.id;
      this.getBhyts({
        thang: 1,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        userName: this.userDetails.id,
      });
    },
    taiTucBHYT2thang() {
      this.searchText = this.userDetails.id;
      this.getBhyts({
        thang: 2,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        userName: this.userDetails.id,
      });
    },

    async loadTaiTucBHXH() {
      const khtts = await this.getDanhSachKhachHangTaiTuc({
        filterItems: [],
        maxResultCount: 500,
        skipCount: 0,
        mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
        tuThang: "2020-01-01 00:00:00",
        denThang: "2025-01-01 00:00:00",
        type: -1,
        loaiDichVu: 0,
      });
      this.capNhatBHXHTN([...new Set(khtts.map((t) => t.maSoBHXH))].join());
    },
    async loadTaiTucBHYT() {
      const khtts = await this.getDanhSachKhachHangTaiTuc({
        filterItems: [],
        maxResultCount: 5000,
        skipCount: 0,
        mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
        tuThang: "2020-01-01 00:00:00",
        denThang: "2025-01-01 00:00:00",
        type: -1,
        loaiDichVu: 1,
      });
      this.dongBoDuLieu([...new Set(khtts.map((t) => t.maSoBHXH))].join());
    },

    async loadBaoCaoChiTietGiaoDich() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();

      if (this.searchText.split(" : ").length !== 2) {
        this.tuNgayDenNgay = this.searchText = `${new Date(year, month - 2, 1)
          .toISOString()
          .slice(0, 10)} : ${new Date(2024, 12, 31)
          .toISOString()
          .slice(0, 10)}`;
      }

      this.$q
        .dialog({
          title: "Báo cáo chi tiết giao dịch",
          message: "Từ ngày : đến ngày?",
          prompt: {
            model: this.searchText,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk(async (data) => {
          const ngays = data.split(" : ");
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
        });
    },
    async inC17() {
      if (!this.bhyts.length && !this.tuNgayDenNgay) {
        Notify.create({
          type: "negative",
          message: "Vào báo cáo giao dịch trước khi xuất C17.",
        });
        this.loadBaoCaoChiTietGiaoDich();
        return;
      }
      this.$q
        .dialog({
          title: "In C17 (quyển)",
          message: "Số biên lai?",
          prompt: {
            model: this.soBienLai,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk(async (data) => {
          if (!data) return;
          const ds = new Map();
          for (let index = 1; index < 10; index++) {
            await ds.set(`${data}0${index}`, {
              tongTien: 0,
              tienBHYT: 0,
              tienBHXH: 0,
              soBienLai: `${data}0${index}`,
              ngayLap: null,
            });
          }
          for (let index = 10; index < 100; index++) {
            await ds.set(`${data}${index}`, {
              tongTien: 0,
              tienBHYT: 0,
              tienBHXH: 0,
              soBienLai: `${data}${index}`,
              ngayLap: null,
            });
          }
          await ds.set(`${parseInt(data + 99) + 1}`, {
            tongTien: 0,
            tienBHYT: 0,
            tienBHXH: 0,
            soBienLai: `${parseInt(data + 99) + 1}`,
            ngayLap: null,
          });
          const xuatc17 = await this.bhyts.filter((t) =>
            t.soBienLai.startsWith(data)
          );
          if (!xuatc17.length) {
            Notify.create({
              type: "negative",
              message: "Không tìm thấy quyển biên lai!",
            });
            return null;
          }
          for (let index = 0; index < this.bhyts.length; index++) {
            const t = this.bhyts[index];
            if (ds.has(t.soBienLai)) {
              const g = ds.get(t.soBienLai);
              ds.set(t.soBienLai, {
                ...g,
                ngayLap: t.ngayLap,
                tienBHYT:
                  t.maThuTuc === 1
                    ? parseInt(t.tongTien) + g.tienBHYT
                    : g.tienBHYT,
                tienBHXH:
                  t.maThuTuc === 0
                    ? parseInt(t.tongTien) + g.tienBHXH
                    : g.tienBHXH,
                tongTien: parseInt(t.tongTien) + g.tongTien,
              });
            }
          }
          await this.sleep(1000);
          const res = await fetch(
            `https://longwebstudio.amycos.vn/wordpress/wp-content/app/api/mau-c17-all/1/pdf?tienBHYT=${xuatc17
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
        });
    },

    async print(maSoBhxhs) {
      let a = document.createElement("a");
      a.target = "_blank";
      let lienKet = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/mau-c17/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?maSoBhxhs=${maSoBhxhs}`;
      a.href = lienKet;
      a.click();
    },

    loadBhytByNamSinh() {
      this.$q
        .dialog({
          title: "Tìm thẻ BHYT theo năm sinh",
          message: "Nhập năm sinh?",
          prompt: {
            model: this.searchText,
            isValid: (val) => val.length == 4, // << here is the magic
            type: "number", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          if (data) this.searchText = data;
          this.getBhyts({
            completed: "0",
            disabled: "0",
            maXa: this.userDetails.maXa,
            nam: data,
          });
        });
    },
    loadBhytByUserName(user) {
      if (!this.searchText) {
        this.searchText = this.userDetails.maNhanVienThu;
      }
      if (user === 1)
        this.getBhyts({
          userName: this.searchText,
          isBHYT: 1,
        });
      else if (user === 0)
        this.getBhyts({
          userName: this.searchText,
          isBHXHTN: 1,
        });
      else
        this.getBhyts({
          userName: this.searchText,
        });
    },
    loadBhytByName() {
      this.$q
        .dialog({
          title: "Tìm thẻ BHYT",
          message: "Nhập nội dung tìm kiếm?",
          prompt: {
            model: this.searchText,
            isValid: (val) => val.length >= 2, // << here is the magic
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.searchText = data;
          this.getBhyts({
            name: data,
            maXa: data.length < 9 ? this.userDetails.maXa : null,
          });
        });
    },
    loadBhyts({ thang = 1 }) {
      this.searchText = "";
      this.getBhyts({
        thang,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        maXa: this.userDetails.maXa,
        name: this.searchText,
      });
    },
    loadTaiTucBHYTBT() {
      this.searchText = "";
      this.getBhyts({
        maXa: this.userDetails.maXa,
        taiTucBHYTBT: "1",
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
      if (danhSachTimKiem.length === 1)
        await this.traCuuBhyts({ searchText, maXa: this.userDetails.maXa });
      const regex = /[0-9]/g;
      for (let index = 0; index < danhSachTimKiem.length; index++) {
        const name = danhSachTimKiem[index]
          .split(" ")
          .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
          .join(" ");
        const maSo = name.match(regex);
        if (maSo) {
          //
          if (danhSachTimKiem.length === 1)
            try {
              await this.getBhyts({
                name: maSo.join(""),
                maXa: maSo.length < 9 ? this.userDetails.maXa : null,
              });
            } catch (error) {}
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
      a.href = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/danh-sach-tra-the/1/pdf?maSoBhxhs=${this.bhyts
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
          [
            ...new Set(
              this.bhyts.map((bhyt) => bhyt.soDienThoai2 || bhyt.soDienThoai)
            ),
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
    copyNamePhoneClipboard() {
      this.download(
        "NamePhone.csv",
        "Name\tPhone\r\n" +
          [
            ...new Set(
              this.bhyts
                .filter((t) => t.soDienThoai2 || t.soDienThoai)
                .map(
                  ({
                    soDienThoai2,
                    soDienThoai,
                    hoTen,
                    ngaySinhDt,
                    userName,
                    soTheBhyt,
                  }) =>
                    `${hoTen} ${soTheBhyt?.slice(0, 2) || ""}${
                      userName == this.userDetails.id ||
                      userName == this.userDetails.maNhanVienThu
                        ? ""
                        : "_"
                    }${new Date(ngaySinhDt).getFullYear()}\t${
                      soDienThoai2 || soDienThoai
                    }`
                )
            ).values(),
          ].join("\r\n")
      );
    },
    download(filename, text) {
      var pom = document.createElement("a");
      pom.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      pom.setAttribute("download", filename);

      if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
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
