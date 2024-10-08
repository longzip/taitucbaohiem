<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-6">
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

          <div class="col-4">
            <q-select
              v-model="selectedUser"
              :options="userOptions"
              @update:modelValue="selectUser"
              label="Lọc theo người dùng"
              outlined
              emit-value
              map-options
              dense
            />
          </div>

          <div class="col-2 text-right">
            Menu
            <q-icon name="expand_more" dense> </q-icon>
            <q-menu v-if="userDetails.isPro" touch-position>
              <q-list style="min-width: 150px">
                <q-item clickable @click="loadBhytByName" v-close-popup>
                  <q-item-section>Tìm tất cả</q-item-section>
                </q-item>
                <q-item clickable @click="dongBo" v-close-popup>
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
                <q-item clickable @click="loadBhytThangCTV" v-close-popup>
                  <q-item-section>Hoa hồng CTV</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="loadBhytByUserName(1)" v-close-popup>
                  <q-item-section>Đã thu tiền BHYT</q-item-section>
                </q-item>
                <q-item clickable @click="loadBhytByUserName(0)" v-close-popup>
                  <q-item-section>Đã thu tiền BHXH</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="taiTucBHYT1thang" v-close-popup>
                  <q-item-section
                    >Tái tục BHYT ({{ userDetails.id }})</q-item-section
                  >
                </q-item>
                <q-item
                  clickable
                  @click="loadBhyts({ thang: 1 })"
                  v-close-popup
                >
                  <q-item-section>Tái tục BHYT(xã)</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="taiTucBHYT2thang" v-close-popup>
                  <q-item-section
                    >Tái tục 2 tháng ({{ userDetails.id }})</q-item-section
                  >
                </q-item>

                <q-item
                  clickable
                  @click="loadBhyts({ thang: 2 })"
                  v-close-popup
                >
                  <q-item-section>Tái tục 2 tháng (xã)</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  @click="
                    loadBHXHTNs({
                      tienNop: 1,
                      taiTucBHXH: 1,
                      userName: userDetails.id,
                    })
                  "
                  v-close-popup
                >
                  <q-item-section>Tái tục BHXH</q-item-section>
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
                  <q-item-section
                    >Đóng BHXH cho {{ userDetails.id }}</q-item-section
                  >
                </q-item>
                <q-item
                  clickable
                  @click="
                    loadBHXHTNs({
                      tienNop: 1,
                      maXa: userDetails.maXa,
                      khacUserName: userDetails.id,
                    })
                  "
                  v-close-popup
                >
                  <q-item-section>Đóng BHXH (xã)</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="loadBhytsHetHanByUser" v-close-popup>
                  <q-item-section
                    >Đã hết hạn {{ userDetails.id }}</q-item-section
                  >
                </q-item>
                <q-item clickable @click="loadBhytsHetHan" v-close-popup>
                  <q-item-section>Đã hết hạn (xã)</q-item-section>
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
                  @click="loadBaoCaoChiTietGiaoDich"
                  v-close-popup
                >
                  <q-item-section>Báo cáo Chi Tiết Giao Dịch</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="loadBaoCaoChiTietGiaoDichBHXH"
                  v-close-popup
                >
                  <q-item-section>Chi Tiết Giao Dịch (BHXH)</q-item-section>
                </q-item>
                <q-item clickable @click="inC17" v-close-popup>
                  <q-item-section>In C17</q-item-section>
                </q-item>
                <q-item clickable @click="printDanhSachTraThe" v-close-popup>
                  <q-item-section>In Danh sách trả thẻ</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  @click="copyMaSoBhxhToClipboard"
                  v-close-popup
                >
                  <q-item-section>Copy tất cả mã số BHXH</q-item-section>
                </q-item>
                <q-item clickable @click="copyHoTenToClipboard" v-close-popup>
                  <q-item-section>Copy tất cả họ tên</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="copySoDienThoaiToClipboard"
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

                <q-item
                  clickable
                  @click="capNhatBHXHTN(searchText)"
                  v-close-popup
                >
                  <q-item-section>Đồng bộ BHXH TN</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  @click="
                    resetBhyt(
                      searchText
                        ? filteredBhyts.filter(
                            (bhyt) => bhyt.userName !== searchText
                          )
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
                        ? filteredBhyts.filter(
                            (bhyt) => bhyt.userName === searchText
                          )
                        : []
                    )
                  "
                  v-close-popup
                >
                  <q-item-section>Giữ lại danh sách</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  @click="
                    resetBhyt(
                      searchText
                        ? bhyts.filter(
                            (bhyt) => !(bhyt.soDienThoai || bhyt.soDienThoai2)
                          )
                        : []
                    )
                  "
                  v-close-popup
                >
                  <q-item-section>Thiếu số điện thoại</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="
                    loadBHXHTNs({
                      isCMND: 1,
                      maXa: userDetails.maXa,
                    })
                  "
                  v-close-popup
                >
                  <q-item-section>Thiếu CCCD</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  @click="loadBhytByUserNameTaiTuc()"
                  v-close-popup
                >
                  <q-item-section>Tái tục</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="
                    getBhyts({
                      isPhone: true,
                      maXa: userDetails.maXa,
                      name: searchText,
                    })
                  "
                  v-close-popup
                >
                  <q-item-section>Có số điện thoại</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="loadBhytByUserName()" v-close-popup>
                  <q-item-section>Đã thu tiền</q-item-section>
                </q-item>
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
          <!-- <q-item-label v-if="userDetails.isPro" header>

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
      <q-card-section v-if="userDetails.isPro">
        Hạn sử dụng: {{ dinhDangNgayThang(userDetails.hetHan) }} ({{
          khoangCachThoiGian(userDetails.hetHan)
        }})
      </q-card-section>
      <q-card-section class="text-red text-bold" v-else>
        Miễn phí sử dụng trọn đời.
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogShow" persistent>
      <BhytUpdateDialog />
    </q-dialog>
  </q-page>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import { Notify } from "quasar";
import BhytUpdateDialog from "src/components/BhytUpdateDialog.vue";
import { api } from "src/boot/axios";
import { xacDinhLoaiChuoi } from "src/utils/chuoi-utils";
import moment from "moment";
export default {
  components: { ThongTinTheBHYT, BhytUpdateDialog },
  data() {
    return {
      tuNgayDenNgay: "",
      soBienLai: "",
      selectedUser: null,
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
    userOptions() {
      return [
        {
          label: "Tất cả",
          value: null,
        },
        {
          label: this.userDetails?.id,
          value: this.userDetails?.id,
        },
        {
          label: this.userDetails?.maNhanVienThu?.slice(0, 4),
          value: this.userDetails?.maNhanVienThu,
        },
        {
          label: this.userDetails?.name?.slice(0, 6),
          value: this.userDetails?.name,
        },
        {
          label: this.userDetails?.maXa,
          value: this.userDetails?.maXa,
        },
        {
          label: "Khác",
          value: "",
        },
      ];
    },
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
      "traCuuTheoTen",
      "getDanhSachKhachHangTaiTuc",
      "copyHoTenToClipboard",
      "batTatRemove",
      "capNhatBHXHTN",
      "searchBhyts",
      "selectUser",
      // mới
      "traCuuBHXH",
      "traCuuMaSoBHXH",
    ]),
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    ...mapMutations({
      setSearchText: "bhyts/SET_SEARCH_TEXT",
    }),
    khoangCachThoiGian(ngay) {
      return moment(ngay).fromNow(true);
    },
    dinhDangNgayThang(ngayThang) {
      if (!ngayThang) return "";
      const ngay = new Date(ngayThang);
      return ngay.toLocaleDateString("vi-VN");
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    taiTucBHYT1thang() {
      this.searchText = "";
      this.getBhyts({
        thang: 1,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        userName: this.userDetails.id,
      });
    },
    taiTucBHYT2thang() {
      this.searchText = "";
      this.getBhyts({
        thang: 2,
        completed: "0",
        disabled: "0",
        taiTuc: "1",
        userName: this.userDetails.id,
      });
    },

    async loadBaoCaoChiTietGiaoDichBHXH() {
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
              maThuTuc: 0,
            });
            this.searchText = "";
          } catch (error) {
            Notify.create({
              message: "Không thể kế nối đến máy chủ !",
              color: "red",
            });
          }
        });
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
            this.searchText = "";
          } catch (error) {
            Notify.create({
              message: "Không thể kế nối đến máy chủ !",
              color: "red",
            });
          }
        });
    },
    async inC17() {
      if (!this.filteredBhyts.length && !this.tuNgayDenNgay) {
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
          const xuatc17 = await this.filteredBhyts.filter((t) =>
            t.soBienLai.startsWith(data)
          );
          if (!xuatc17.length) {
            Notify.create({
              type: "negative",
              message: "Không tìm thấy quyển biên lai!",
            });
            return null;
          }
          for (let index = 0; index < this.filteredBhyts.length; index++) {
            const t = this.filteredBhyts[index];
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
        });
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
          // if (data) this.searchText = data;
          this.getBhyts({
            completed: "0",
            disabled: "0",
            maXa: this.userDetails.maXa,
            nam: data,
          });
        });
    },
    loadBhytByUserNameTaiTuc() {
      this.getBhyts({
        userName: this.searchText,
        completed: "0",
        disabled: "0",
      });
    },
    loadBhytByUserName(user) {
      if (!this.searchText) {
        // this.searchText = this.userDetails.maNhanVienThu;
      }
      if (user === 1)
        this.getBhyts({
          userName: this.userDetails.maNhanVienThu,
          isBHYT: 1,
        });
      else if (user === 0)
        this.getBhyts({
          userName: this.userDetails.maNhanVienThu,
          isBHXHTN: 1,
        });
      else
        this.getBhyts({
          userName: this.searchText || this.userDetails.id,
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
    loadBhytThangCTV() {
      this.searchText = "";
      this.$q
        .dialog({
          title: "Tháng biên lai",
          message: "Nhập tháng?",
          prompt: {
            model: new Date().getMonth() + 1,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          // this.searchText = data || ;
          this.getBhyts({
            thangBienLai: data,
            khacUserName: this.userDetails.id,
            maXa: this.userDetails.maXa,
          });
        });
    },
    loadBhytThang() {
      this.searchText = "";
      this.$q
        .dialog({
          title: "Tháng biên lai",
          message: "Nhập tháng?",
          prompt: {
            model: new Date().getMonth() + 1,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          // this.searchText = data || ;
          this.getBhyts({
            thangBienLai: data,
            userName: this.userDetails.id,
          });
        });
    },
    loadBHXHThang() {
      this.searchText = "";
      this.$q
        .dialog({
          title: "Tháng biên lai",
          message: "Nhập tháng?",
          prompt: {
            model: new Date().getMonth() + 1,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          // this.searchText = data || new Date().getMonth() + 1;
          this.getBhyts({
            thangBienLaiTN: data,
            userName: this.userDetails.id,
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
        khacUserName: this.userDetails.id,
      });
    },
    loadTaiTucBHYTBT() {
      this.searchText = "";
      this.getBhyts({
        userName: this.userDetails.id,
        taiTucBHYTBT: "1",
      });
    },
    loadBHXHTNs(data) {
      this.searchText = "";
      this.getBhyts({
        ...data,
        name: this.searchText,
      });
    },
    loadBhytsHetHanByUser() {
      this.searchText = "";
      this.getBhyts({
        userName: this.userDetails.id,
        completed: "0",
        disabled: "0",
        hetHan: "1",
      });
    },
    loadBhytsHetHan() {
      this.searchText = "";
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: "0",
        disabled: "0",
        hetHan: "1",
        khacUserName: this.userDetails.id,
      });
    },
    loadBhytsDisable() {
      this.searchText = "";
      this.getBhyts({
        maXa: this.userDetails.maXa,
        disabled: 1,
      });
    },
    loadBhytsCompleted() {
      this.searchText = "";
      this.getBhyts({
        maXa: this.userDetails.maXa,
        completed: 1,
        disabled: "0",
      });
    },
    async timKiem(searchText) {
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
              maXa: this.userDetails.maXa,
              userName: this.userDetails.id,
              maHuyen: this.userDetails.maHuyen,
              maTinh: this.userDetails.maTinh,
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
      a.href = `https://app.hotham.vn/danh-sach-tra-the/1/pdf?maSoBhxhs=${this.filteredBhyts
        .map((i) => i.maSoBhxh)
        .join(",")}`;
      a.click();
    },
    copyMaSoBhxhToClipboard() {
      navigator.clipboard
        .writeText(this.filteredBhyts.map((bhyt) => bhyt.maSoBhxh))
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
              this.filteredBhyts.map(
                (bhyt) => bhyt.soDienThoai2 || bhyt.soDienThoai
              )
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
      const mapSoDienThoai = new Map();
      for (let bhyt of this.filteredBhyts) {
        mapSoDienThoai.set(bhyt.soDienThoai2 || bhyt.soDienThoai, bhyt);
      }
      this.download(
        "NamePhone.csv",
        "Name\tPhone\r\n" +
          [
            ...new Set(
              [...mapSoDienThoai.values()].map(
                ({
                  soDienThoai2,
                  soDienThoai,
                  hoTen,
                  ngaySinhDt,
                  denNgayDt,
                  userName,
                  soTheBhyt,
                }) =>
                  `${hoTen} T${new Date(denNgayDt).getMonth() + 1}${
                    soTheBhyt?.slice(0, 2) || ""
                  }${
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
    async dongBo() {
      if (this.filteredBhyts.length === 0) return;
      // for (let index = 0; index < this.filteredBhyts.length; index++) {
      //   await this.traCuuBHXH(this.filteredBhyts[index].maSoBhxh)
      this.dongBoDuLieu(this.filteredBhyts.map((bhyt) => bhyt.maSoBhxh).join());
    },
  },
  watch: {
    getCurrentBhyt: function (newBhyt) {
      if (newBhyt) this.dialogShow = true;
      else this.dialogShow = false;
    },
    userDetails: async function ({ maXa }) {
      if (!maXa) return;
      // await this.getBhyts({
      //   thang: 2,
      //   completed: "0",
      //   disabled: "0",
      //   taiTuc: "1",
      //   maXa,
      // });

      api
        .post("/api/update-bhyt-data", {
          api_key: this.userDetails.isLogin, // Truyền API key từ biến
          mang_luoi_id: this.userDetails.quaTrinhCongTac.mangLuoiId, // Truyền mạng lưới ID từ biến
          user_name: this.userDetails.id,
          force: false,
        })
        .then((response) => {
          console.log("Cập nhật dữ liệu Bhyt thành công!");
        })
        .catch((error) => {
          console.error("Lỗi cập nhật dữ liệu Bhyt:", error);
        });
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
