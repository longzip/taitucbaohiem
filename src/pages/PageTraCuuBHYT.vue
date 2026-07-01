<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Cột Tìm kiếm -->
          <div class="col-12 col-md-4">
            <q-input
              label="Tìm kiếm"
              outlined
              v-model="searchText"
              debounce="900"
              ref="inputSearch"
              @keyup.enter="timKiem(searchText)"
              dense
            >
              <template v-slot:append>
                <q-icon v-if="searchText === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="searchText = ''"
                />
              </template>
            </q-input>
          </div>

          <!-- Cột Lọc theo người dùng -->
          <div class="col-12 col-md-3">
            <q-select
              v-model="selectedUser"
              :options="userOptions"
              @update:modelValue="selectUser"
              label="Lọc theo người dùng"
              outlined
              emit-value
              map-options
              dense
              clearable
            />
          </div>

          <!-- BỔ SUNG: Cột Lọc theo trạng thái -->
          <div class="col-12 col-md-3">
            <q-select
              v-model="selectedStatus"
              :options="statusOptions"
              @update:modelValue="selectStatus"
              label="Lọc theo trạng thái"
              outlined
              emit-value
              map-options
              dense
              clearable
            />
          </div>

          <!-- Cột Menu -->
          <div class="col-12 col-md-2 text-right">
            Menu
            <q-icon name="expand_more" dense> </q-icon>
            <q-menu touch-position>
              <q-list style="min-width: 150px">
                <q-item clickable @click="loadBhytByUserName()" v-close-popup>
                  <q-item-section>Đã thu tiền</q-item-section>
                </q-item>
                <q-item clickable @click="moCuaSoVoiMaSo" v-close-popup>
                  <q-item-section>Đồng bộ dữ liệu</q-item-section>
                </q-item>
                <q-item clickable @click="loadTaiTucBHYTBT" v-close-popup>
                  <q-item-section>Tái tục BHYT bổ trợ</q-item-section>
                </q-item>
                <q-item clickable @click="loadBhytThang" v-close-popup>
                  <q-item-section>Hoa hồng BHYT</q-item-section>
                </q-item>
                <q-item clickable @click="loadBHXHThang" v-close-popup>
                  <q-item-section>Hoa hồng BHXH TN</q-item-section>
                </q-item>
                <q-separator />
                <q-separator />
                <q-item clickable @click="loadBhytByUserName(1)" v-close-popup>
                  <q-item-section>Đã thu tiền BHYT</q-item-section>
                </q-item>
                <q-item clickable @click="loadBhytByUserName(0)" v-close-popup>
                  <q-item-section>Đã thu tiền BHXH</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="taiTucBHYT1thang" v-close-popup>
                  <q-item-section>Tái tục BHYT</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable @click="taiTucBHYT2thang" v-close-popup>
                  <q-item-section>Tái tục 2 tháng</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable @click="loadBHXHTNs()" v-close-popup>
                  <q-item-section>Tái tục BHXH</q-item-section>
                </q-item>

                <q-separator />
                <q-item clickable @click="loadBhytsHetHanByUser" v-close-popup>
                  <q-item-section>Đã hết hạn</q-item-section>
                </q-item>
                <q-item clickable @click="loadBhytsDisable" v-close-popup>
                  <q-item-section>Đã liên hệ</q-item-section>
                </q-item>
                <q-item clickable @click="loadBhytsCompleted" v-close-popup>
                  <q-item-section>Đánh dấu sao</q-item-section>
                </q-item>
                <q-separator />

                <q-item
                  clickable
                  @click="copySoDienThoai(filteredBhyts)"
                  v-close-popup
                >
                  <q-item-section>Copy tất cả số điện thoại</q-item-section>
                </q-item>
                <q-item clickable @click="copyNamePhoneClipboard" v-close-popup>
                  <q-item-section>Lưu danh bạ</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="loadBhytByNamSinh" v-close-popup>
                  <q-item-section>Tìm theo năm sinh</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="filteredBhyts.length">
        <q-expansion-item
          v-if="tongSoBHXH === filteredBhyts.length"
          v-model="expanded"
          :label="`Tổng tiền BHXH TN: ${parseInt(
            tongTienBHXH
          ).toLocaleString()}/ ${tongSoBHXH} sổ`"
          caption="Xem chi tiết"
        >
          Hoa hồng:
          {{ parseInt((tongTienBHXH * 0.049).toFixed(0)).toLocaleString() }}
          <br />
          Hoa hồng BHXH (năm):
          {{
            parseInt(
              (
                (tongMucDongBHXH * 0.22 - tongSoBHXH * 66000) *
                0.049 *
                12
              ).toFixed(0)
            ).toLocaleString()
          }}đ ({{ parseInt(tongMucDongBHXH).toLocaleString() }})
        </q-expansion-item>
        <q-expansion-item
          v-else
          v-model="expanded"
          :label="`Tổng tiền: ${parseInt(tongTienBHYT).toLocaleString()}/ ${
            filteredBhyts.length
          } thẻ`"
          caption="Xem chi tiết"
        >
          <strong
            >Hoa hồng BHYT:
            {{ parseInt((tongTienBHYT * 0.0264).toFixed(0)).toLocaleString() }}
            ({{
              parseInt(
                ((tongTienBHYT / (filteredBhyts.length || 1)) * 0.0264).toFixed(
                  0
                )
              ).toLocaleString()
            }}/thẻ)</strong
          >
          <br />
          <br />
          Hoa hồng BHXH (năm):
          {{
            parseInt(
              (
                (tongMucDongBHXH * 0.22 - tongSoBHXH * 66000) *
                0.049 *
                12
              ).toFixed(0)
            ).toLocaleString()
          }}đ ({{ parseInt(tongMucDongBHXH).toLocaleString() }})
          <br />
          <span
            >Có {{ tongSoBHXH }} BHXHTN (tái tục):
            {{ parseInt((tongTienBHXH * 0.049).toFixed(0)).toLocaleString() }}
            ({{ parseInt(tongTienBHXH).toLocaleString() }})
          </span>
        </q-expansion-item>
        <q-list>
          <!-- <q-item-label header>

          </q-item-label> -->
          <div v-for="bhyt in filteredBhyts" :key="bhyt.id">
            <ThongTinTheBHYT :bhyt="bhyt" />
            <q-separator spaced inset />
          </div>
        </q-list>
      </q-card-section>
      <q-card-section v-else>
        Nhập họ và tên hoặc mã số BHXH, mã thẻ BHYT vào ô Tìm kiếm và nhấn ENTER
        để tra cứu.
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogShow" persistent>
      <BhytUpdateDialog />
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import { useQuasar, Notify } from "quasar";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import BhytUpdateDialog from "src/components/BhytUpdateDialog.vue";
import { useDanhBaGenerator } from "src/utils/useDanhBaGenerator";
import { xacDinhLoaiChuoi } from "src/utils/chuoi-utils";
import { downloadFile } from "src/utils/download";
import {
  copyMaSoBhxh,
  copySoDienThoai,
  prepareDanhBa,
} from "src/utils/clipboard";
import { khoangCachThoiGian, dinhDangNgayThang } from "src/utils/formatters";
import { userOptions, statusOptions } from "src/constants/tra-cuu-options";

const { exportDanhBaCSV } = useDanhBaGenerator();

export default defineComponent({
  name: "PageTraCuuBHYT",
  components: { ThongTinTheBHYT, BhytUpdateDialog },
  setup() {
    const $q = useQuasar();
    return { $q, userOptions, statusOptions };
  },
  data() {
    return {
      tuNgayDenNgay: "",
      soBienLai: "",
      selectedUser: null,
      selectedStatus: null,
      dialogShow: false,
      expanded: false,
    };
  },
  computed: {
    ...mapGetters("bhyts", [
      "bhyts",
      "filteredBhyts",
      "tongTienBHXH",
      "tongMucDongBHXH",
      "tongSoBHXH",
      "getCurrentBhyt",
    ]),
    ...mapState("auth", ["userDetails"]),
    tongTienBHYT() {
      if (this.filteredBhyts.length === 0) return 0;
      return this.filteredBhyts
        .map((t) => t.tongTien || 0)
        .reduce(
          (previousValue, currentValue) =>
            previousValue + parseInt(currentValue),
          0
        );
    },
    searchText: {
      get() {
        return this.$store.state.bhyts.searchText; // Lấy giá trị searchText từ Vuex
      },
      set(value) {
        this.$store.commit("bhyts/SET_SEARCH_TEXT", value); // Cập nhật giá trị searchText trong Vuex
      },
    },
  },
  methods: {
    ...mapActions("bhyts", [
      "getBhyts",
      "resetBhyt",
      "traCuuBhyts",
      "updateBhyt",
      "hoSoDaXuLy",
      "dongBoDuLieu",
      "dongBoMaSo",
      "traCuuTheoTen",
      "getDanhSachKhachHangTaiTuc",
      "copyHoTenToClipboard",
      "batTatRemove",
      "capNhatBHXHTN",
      "searchBhyts",
      "selectUser",
      "selectStatus",
      // mới
      "traCuuBHXH",
      "traCuuMaSoBHXH",
    ]),
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    ...mapMutations({
      setSearchText: "bhyts/SET_SEARCH_TEXT",
    }),
    dinhDangNgayThang,
    khoangCachThoiGian,
    copyMaSoBhxh,
    copySoDienThoai,
    handleExport() {
      exportDanhBaCSV(this.filteredBhyts);
    },
    sleep(ms = 500) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    taiTucBHYT1thang() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          thang: 1,
          completed: "0",
          disabled: "0",
          taiTuc: "1",
          userName: this.selectedUser,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    taiTucBHYT2thang() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          thang: 1,
          completed: "0",
          disabled: "0",
          taiTuc: 2,
          userName: this.userDetails.id,
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    loadBhytByNamSinh() {
      this.searchText = "";
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
          this.$q.loading.show();
          try {
            this.getBhyts({
              completed: "0",
              disabled: "0",
              nam: data,
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    loadBhytByUserName(user) {
      this.$q.loading.show();
      try {
        if (!this.searchText) {
          // this.searchText = 'NV034186013128';
        }
        if (user === 1)
          this.getBhyts({
            userName: "NV034186013128",
            isBHYT: 1,
          });
        else if (user === 0)
          this.getBhyts({
            userName: "NV034186013128",
            isBHXHTN: 1,
          });
        else
          this.getBhyts({
            userName: this.selectedUser || "NV034186013128",
          });
      } finally {
        this.$q.loading.hide();
      }
    },

    loadBhytThang() {
      this.searchText = "";
      this.$q
        .dialog({
          title: "Tháng biên lai",
          message: "Nhập tháng?",
          prompt: {
            model: 0,
            type: "number", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.$q.loading.show();
          try {
            this.getBhyts({
              thangBienLai: data.toString(),
              userName: this.selectedUser,
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    loadBHXHThang() {
      this.searchText = "";
      this.$q
        .dialog({
          title: "Tháng biên lai",
          message: "Nhập tháng?",
          prompt: {
            model: 0,
            type: "number", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.$q.loading.show();
          try {
            this.getBhyts({
              thangBienLaiTN: data.toString(),
              userName: this.userDetails.id,
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },
    loadTaiTucBHYTBT() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          taiTucBHYTBT: "1",
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    loadBHXHTNs() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          tienNop: 1,
          taiTucBHXH: 1,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    loadBhytsHetHanByUser() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          userName: this.selectedUser,
          completed: "0",
          disabled: "0",
          hetHan: "1",
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    loadBhytsDisable() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          disabled: 1,
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    loadBhytsCompleted() {
      this.$q.loading.show();
      try {
        this.searchText = "";
        this.getBhyts({
          completed: 1,
          disabled: "0",
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    async timKiem(searchText) {
      this.$q.loading.show();
      try {
        const thongSoTheBHYTs = searchText.split("|");
        if (thongSoTheBHYTs.length > 1) {
          searchText = thongSoTheBHYTs[0];
          this.setSearchText(thongSoTheBHYTs[0]); // Gọi mutation SET_SEARCH_TEXT để cập nhật state
        }
        const danhSachTimKiem = searchText.split(",");

        const regex = /[0-9]/g;

        for (let index = 0; index < danhSachTimKiem.length; index++) {
          const name = danhSachTimKiem[index]
            .split(" ")
            .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
            .join(" ");
          const maSo = name.match(regex);
          const loaiTimKiem = xacDinhLoaiChuoi(maSo?.join(""));

          if (loaiTimKiem === "Dãy 10 chữ số cuối") {
            try {
              const maSoBHXHTimKiem = maSo.join("").slice(-10);
              this.traCuuBHXH(maSoBHXHTimKiem);
              this.searchText = maSoBHXHTimKiem;
            } catch (error) {
              console.log(error);
            }
          } else {
            try {
              await this.traCuuMaSoBHXH({
                hoTen: name,
                userName: "3152",
              });
            } catch (error) {
              Notify.create({
                type: "negative",
                message: "Không thực hiện được!" + error,
              });
            }
          }
        }
        if (danhSachTimKiem.length > 1) {
          this.searchText = "";
        }
        this.$refs.inputSearch.select();

        const query = { ...this.$route.query, q: searchText };
        this.$router.replace({ query });
        if (this.filteredBhyts.length === 0)
          Notify.create({
            type: "negative",
            position: "top",
            message: "Không tìm thấy!",
          });
        else
          Notify.create({
            type: "positive",
            position: "top",
            message: "Tìm thấy: " + this.filteredBhyts.length + " thẻ!",
          });
      } finally {
        this.$q.loading.hide();
      }
    },

    async khoiTao() {
      if (this.$route.query.q) {
        this.$q.loading.show();
        try {
          await this.sleep();
          this.searchText = this.$route.query.q;
          await this.timKiem(this.searchText);
        } finally {
          this.$q.loading.hide();
        }
      }
    },

    // Hàm để mở URL với mã số tương ứng
    moCuaSoVoiMaSo() {
      // BƯỚC 1: Trích xuất danh sách mã số từ mảng đối tượng
      // this.filteredBhyts có thể đến từ state, props hoặc một thuộc tính của class.

      // BƯỚC 2: Kiểm tra xem danh sách vừa tạo có rỗng hay không
      if (this.filteredBhyts.length === 0) {
        console.log("Không có mã số nào để tra cứu. Danh sách rỗng.");
        // Bạn có thể hiển thị một thông báo cho người dùng ở đây
        // alert("Không có dữ liệu BHYT để tra cứu!");
        return; // Dừng thực thi nếu không có gì để làm
      }
      let index = 0;
      const thoiGianDelay = 8000; // 6 giây là thời gian chờ giữa các lần truy cập giây

      const intervalId = setInterval(() => {
        if (index < this.filteredBhyts.length) {
          const { maSoBhxh, hoTen, ngaySinhDt } = this.filteredBhyts[index];
          const url = `https://ssm.vnpost.vn/qldv/tra-cuu/tra-cuu-thong-tin-the?maSoBHXH=${maSoBhxh}&hoTen=${hoTen}&ngaySinhDt=${ngaySinhDt}`;
          window.open(url, "_blank");
          index++;
        } else {
          clearInterval(intervalId); // Dừng vòng lặp khi đã duyệt hết danh sách
          console.log("Đã mở tất cả các URL.");
        }
      }, thoiGianDelay);
    },
    copyNamePhoneClipboard() {
      const danhBaText = prepareDanhBa(this.filteredBhyts);
      downloadFile("NamePhone.csv", danhBaText);
    },
  },
  watch: {
    getCurrentBhyt: function (newBhyt) {
      if (newBhyt) this.dialogShow = true;
      else this.dialogShow = false;
    },
  },
  mounted() {
    this.khoiTao();
  },
});
</script>

<style>
.list-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
</style>
