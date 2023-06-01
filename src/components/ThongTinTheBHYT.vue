<template>
  <q-item
    :class="{
      'bg-warning': bhyt.coTheUuTienCaoHon,
      'bg-warning': bhyt.coTheUuTienCaoHon == 1,
      'bg-positive': getDateDiff(bhyt.denNgayDt) > 30,
      'bg-blue-grey-3': getDateDiff(bhyt.denNgayDt) < 1,
    }"
  >
    <q-item-section>
      <q-item-label
        ><q-icon
          :class="bhyt.gioiTinh == 1 ? 'text-pink' : 'text-primary'"
          :name="bhyt.gioiTinh == 1 ? 'female' : 'male'"
        />{{ bhyt.hoTen || bhyt.hoVaTen }}
        {{ bhyt.ngaySinhDt || bhyt.ngayThangNamSinh }}

        <q-icon
          @click="xacNhanLoaiBo(bhyt)"
          :name="bhyt.disabled == 1 ? 'do_not_disturb_on' : 'delete_forever'"
          :color="bhyt.disabled == 1 ? 'red' : 'gray'"
        />

        <q-icon
          class="q-ml-sm"
          @click="
            dongBoDuLieu(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="update"
          color="blue"
        />
      </q-item-label>
      <q-item-label caption lines="2">
        {{ bhyt.diaChiLh }}
      </q-item-label>
      <q-item-label caption lines="2">
        Mã hộ:<a target="_blank" :href="`/#/ho-gia-dinh/${bhyt.maHoGd}`">{{
          bhyt.maHoGd
        }}</a>
        {{ bhyt.mqhChuHo }}
      </q-item-label>
      <q-item-label caption lines="2">
        Số CMND: {{ bhyt.soCmnd }}
      </q-item-label>
      <q-item-label caption lines="2"
        ><a
          target="_blank"
          :href="`https://thambuudien.ga/tra-thoi-han-bao-hiem-y-te?q=${
            bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
          }`"
          >{{
            bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
          }}</a
        >
        <q-icon
          class="q-ml-md"
          @click="
            copyTextToClipboard(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="content_copy"
        />

        <q-icon
          class="q-ml-md"
          @click="copyUrlToClipboard(bhyt)"
          name="share"
        />
        <q-icon
          class="q-ml-md"
          @click="copyBHXHToClipboard(bhyt.maSoBhxh || bhyt.maSoBHXH)"
          name="paid"
        />
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.maKCB }}</q-item-label>
      <q-item-label caption lines="2"
        >5 năm:{{
          bhyt.ngay5Nam || bhyt.trangThaiHoSoName || bhyt.moTa
        }}</q-item-label
      >
      <q-item-label caption lines="2">
        {{ bhyt.ghiChu || "Ghi chú:" }}
        <q-icon @click="xacNhanGhiChu(bhyt)" name="edit" />
      </q-item-label>
      <q-item-label v-if="bhyt.soDienThoai" caption>
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
        <q-icon
          class="q-ml-md"
          @click="copySDTToClipboard(bhyt.soDienThoai)"
          name="content_copy"
        />
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption
        >{{ getDateDiff(bhyt.denNgayDt) }} ngày
        <q-icon
          @click="xoaThanhVienHGD(bhyt.maSoBhxh)"
          name="person_remove_alt_1"
      /></q-item-label>
      <q-item-label caption
        >Đến:{{ bhyt.denNgayDt || bhyt.ngayDenHan }}</q-item-label
      >
      <q-item-label @click="xacNhanGiaHan(bhyt)" caption>
        <strong class="text-subtitle2 text-weight-bold">{{
          bhyt.tongTien || bhyt.soTienThu || bhyt.soPhaiDong
            ? parseInt(
                bhyt.tongTien || bhyt.soTienThu || bhyt.soPhaiDong
              ).toLocaleString()
            : "0"
        }}</strong
        >đ</q-item-label
      >
      <q-icon
        @click="xacNhanTheoDoi(bhyt)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      />
      <q-item-label caption
        >{{
          bhyt.ngayLap ||
          bhyt.ngayBienLai ||
          new Date(bhyt.updated_at).toLocaleString()
        }}<br />
        {{ bhyt.soBienLai }}<br />
        <q-badge v-if="bhyt.userName" color="gray">{{ bhyt.userName }}</q-badge>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  props: ["bhyt"],
  methods: {
    ...mapActions("bhyts", [
      "updateGhiChu",
      "loaiBo",
      "theoDoi",
      "dongBoDuLieu",
      "getTraCuuThongTinBHXHTN",
      "thuTien",
      "xoaThanhVienHGD",
    ]),
    xacNhanLoaiBo(bhyt) {
      if (!bhyt.maSoBhxh) bhyt.maSoBhxh = bhyt.maSoBHXH;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn loại bỏ?",
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          this.loaiBo(bhyt);
        });
    },
    xacNhanGhiChu(bhyt) {
      this.$q
        .dialog({
          title: "Ghi chú",
          message: "Nội dung ghi chú?",
          prompt: {
            model: bhyt.ghiChu,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.updateGhiChu({
            ghiChu: data,
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
          });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    xacNhanGiaHan(bhyt) {
      this.$q
        .dialog({
          title: "Gia hạn thẻ BHYT",
          message: "Mức đóng bảo hiểm",
          options: {
            type: "radio",
            model: bhyt.tongTien,
            // inline: true
            items: [
              { label: "T1: 804.600đ", value: "804600", color: "secondary" },
              { label: "T2: 563.220đ", value: "563220" },
              { label: "T3: 482.760đ", value: "482760" },
              { label: "T4: 402.300đ", value: "402300" },
              { label: "T5: 321.840đ", value: "321840" },
              { label: "Không", value: "" },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.thuTien({
            tongTien: data,
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
          });
        });
    },
    xacNhanTheoDoi(bhyt) {
      if (!bhyt.maSoBhxh) bhyt.maSoBhxh = bhyt.maSoBHXH;
      this.$q
        .dialog({
          title: "Confirm",
          message: "Bạn có muốn theo dõi?",
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          this.theoDoi(bhyt);
        });
    },
    getDateDiff(ngayHetHan) {
      if (!ngayHetHan) return "";
      return date.getDateDiff(new Date(ngayHetHan), new Date(), "days");
    },
    async copyBHXHToClipboard(maSoBhxh) {
      try {
        const t = await this.getTraCuuThongTinBHXHTN({ maSoBhxh });
        if (!t) {
          Notify.create({
            type: "negative",
            message: "Không tham gia BHXH Tự Nguyện",
          });
          return null;
        }
        const tienHaNoiHoTro =
          t.tienNsnnHoTro == parseInt(t.phuongThucDong) * 33000
            ? t.tienNsnnHoTro
            : 0;
        navigator.clipboard
          .writeText(
            `Xin chào! Mã sổ BHXH: ${t.maSoBhxh}, Họ tên: ${
              t.hoTen
            }, Ngày sinh: **/**/${new Date(
              t.ngaySinhDt
            ).toLocaleDateString()}; Tên đơn vị đang tham gia: Hồ Thị Thắm - Đại lý ${
              t.tenDonVi
            }, ngày đăng ký ${t.ngayDk} mức đóng ${parseInt(
              t.mucDong
            ).toLocaleString()}đ (tiền ngân sách hỗ trợ ${parseInt(
              t.tienNsnnHoTro + tienHaNoiHoTro
            ).toLocaleString()}đ). Đóng tiếp ${
              t.phuongThucDong
            } BHXH TN, tháng bắt đầu ${t.thangBd.slice(4)}/${t.thangBd.slice(
              0,
              4
            )} số tiền phải đóng ${parseInt(
              t.tienNldPhaiNop - tienHaNoiHoTro
            ).toLocaleString()}đ. Kết nối với Hồ Thị Thắm tại m.hotham.vn`
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
        this.$q
          .dialog({
            title: "Thu BHXH",
            message: `Mã sổ BHXH: ${t.maSoBhxh}, Họ tên: ${
              t.hoTen
            }, Ngày sinh: **/**/${new Date(
              t.ngaySinhDt
            ).toLocaleDateString()}; Tên đơn vị đang tham gia: Hồ Thị Thắm - Đại lý ${
              t.tenDonVi
            }, ngày đăng ký ${t.ngayDk} mức đóng ${parseInt(
              t.mucDong
            ).toLocaleString()}đ (tiền ngân sách hỗ trợ ${parseInt(
              t.tienNsnnHoTro + tienHaNoiHoTro
            ).toLocaleString()}đ). Đóng tiếp ${
              t.phuongThucDong
            } BHXH TN, tháng bắt đầu ${t.thangBd.slice(4)}/${t.thangBd.slice(
              0,
              4
            )} số tiền phải đóng ${parseInt(
              t.tienNldPhaiNop - tienHaNoiHoTro
            ).toLocaleString()}đ.`,
            prompt: {
              model: (t.tienNldPhaiNop - tienHaNoiHoTro).toLocaleString(),
              type: "text", // optional
            },
            cancel: true,
            persistent: true,
          })
          .onOk((data) => {
            this.thuTien({
              tongTien: data,
              maSoBhxh,
              userName: 0,
            });
          });
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Không thực hiện được!" + error,
        });
      }
    },
    copyUrlToClipboard(t) {
      const [nam, thang, ngay] = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-");
      navigator.clipboard
        .writeText(
          new Date(t.denNgayDt) <= new Date(nam, parseInt(thang) + 1, 0)
            ? `
          Xin chào! Mã thẻ: ${
            t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
          }, Họ tên: ${t.hoTen || t.hoVaTen}, Ngày sinh: **/**/${new Date(
                t.ngaySinhDt
              ).getFullYear()}; Hạn thẻ: ${new Date(
                t.tuNgayDt
              ).toLocaleDateString()} - ${new Date(
                t.denNgayDt
              ).toLocaleDateString()} (còn ${this.getDateDiff(
                t.denNgayDt
              )} ngày); Thời điểm đủ 5 năm liên tục: ${t.ngay5Nam.slice(
                6,
                8
              )}/${t.ngay5Nam.slice(4, 6)}/${t.ngay5Nam.slice(0, 4)}.
          Xem thêm Mức đóng bảo hiểm y tế hộ gia đình năm 2023 tại https://blog.hotham.vn/muc-dong-bao-hiem-y-te-ho-gia-dinh-nam-2023/ .  Người dân khi muốn gia hạn thẻ bảo hiểm y tế (BHYT) hộ gia đình có giảm trừ mức đóng chỉ cần đến trực tiếp Điểm thu BHXH, BHYT Bưu điện xã Tự Lập (cạnh trạm y tế xã) gặp chị Hồ Thị Thắm (thay anh Lập nghỉ) thông báo số BHXH (cung cấp mã thẻ BHYT cũ), nộp tiền đóng BHYT.`
            : `
          Thẻ hợp lệ! Mã thẻ: ${
            t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
          }, Họ tên: ${t.hoTen || t.hoVaTen}, Ngày sinh: **/**/${new Date(
                t.ngaySinhDt
              ).getFullYear()}; Hạn thẻ: ${new Date(
                t.tuNgayDt
              ).toLocaleDateString()} - ${new Date(
                t.denNgayDt
              ).toLocaleDateString()} (còn ${this.getDateDiff(
                t.denNgayDt
              )} ngày); Thời điểm đủ 5 năm liên tục: ${t.ngay5Nam.slice(
                6,
                8
              )}/${t.ngay5Nam.slice(4, 6)}/${t.ngay5Nam.slice(0, 4)}.
          Xem thêm Những cách theo dõi quá trình tham gia và giá trị sử dụng thẻ BHYT, nhằm đảm bảo quyền lợi liên tục tại https://blog.hotham.vn/nhung-cach-theo-doi-qua-trinh-tham-gia-va-gia-tri-su-dung-the-bhyt-nham-dam-bao-quyen-loi-lien-tuc/ .  Để biết thêm thông tin, người dân có thể trực tiếp đến Điểm thu BHXH, BHYT Bưu điện xã Tự Lập (cạnh trạm y tế xã) gặp chị Hồ Thị Thắm (thay anh Lập nghỉ), hoặc liên hệ đến Tổng đài Chăm sóc khách hàng của BHXH Việt Nam theo số 1900 9068 để được hướng dẫn, hỗ trợ./.`
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
    copyTextToClipboard(maSoBhxh) {
      navigator.clipboard
        .writeText(maSoBhxh.toString().slice(maSoBhxh.length - 10))
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
    copySDTToClipboard(soDienThoai) {
      navigator.clipboard
        .writeText(soDienThoai.toString().slice(soDienThoai.length - 10))
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
  filters: {
    tien: function (value) {
      if (!value) return "0đ";
      return parseInt(value).toLocaleString();
    },
  },
};
</script>
