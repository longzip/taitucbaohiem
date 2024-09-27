<template>
  <q-item
    :class="{
      'bg-warning': bhyt.coTheUuTienCaoHon,
      'bg-warning': bhyt.coTheUuTienCaoHon == 1,
      'bg-positive': !isDateBeforeLastDayNextMonth(bhyt.denNgayDt),
      'bg-blue-grey-3': getDateDiff(bhyt.denNgayDt) < 0,
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
          v-if="userDetails.isPro"
          @click="xacNhanLoaiBo(bhyt)"
          :name="bhyt.disabled == 1 ? 'do_not_disturb_on' : 'delete_forever'"
          :color="bhyt.disabled == 1 ? 'red' : 'gray'"
        />
      </q-item-label>
      <q-item-label caption lines="2">
        {{ bhyt.diaChiLh }}
      </q-item-label>
      <div v-if="userDetails.isPro">
        <q-item-label caption lines="2">
          Mã hộ:<a target="_blank" :href="`/#/ho-gia-dinh/${bhyt.maHoGd}`">{{
            bhyt.maHoGd
          }}</a>
          {{ bhyt.mqhChuHo }}
        </q-item-label>
        <q-item-label v-if="bhyt.uniqid" caption lines="2">
          Tờ khai:<a target="_blank" :href="`/#/ho-gia-dinh/${bhyt.uniqid}`">{{
            bhyt.uniqid
          }}</a
          ><a
            target="_blank"
            :href="`https://app.hotham.vn/thanh-vien-ho-gia-dinh-by/${bhyt.uniqid}/pdf`"
            ><q-icon class="q-ml-sm" name="print" color="blue"
          /></a>
        </q-item-label>
      </div>
      <q-item-label caption> CCCD: {{ bhyt.soCmnd }} </q-item-label>
      <q-item-label caption lines="2"
        ><strong>{{
          bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
        }}</strong>
        <q-icon
          class="q-ml-md"
          @click="
            copyTextToClipboard(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="content_copy"
        />
        <q-icon class="q-ml-md" @click="copyThoiHan(bhyt)" name="text_format" />
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.maKCB }}</q-item-label>
      <q-item-label caption lines="2">5 năm: {{ bhyt.ngay5Nam }}</q-item-label>

      <!-- <q-item-label v-if="userDetails.isPro && bhyt.tienNop" caption
        ><span
          @click="setCurrentBhyt(bhyt)"
          :class="{
            'bg-red text-white text-bold q-pa-xs':
              getDateDiff(bhyt.denThangDt) < 32,
          }"
          ><strong>T{{ bhyt.tuThangTN }}+{{ bhyt.maPhuongThucDong }}:</strong>
          {{ bhyt.mucDong }} {{ bhyt.denThangDt?.slice(0, 7) }}</span
        ></q-item-label
      > -->
      <q-item-label v-if="userDetails.isPro && bhyt.tienNop" caption
        ><span @click="setCurrentBhyt(bhyt)"
          >BHXH
          <strong>T{{ bhyt.tuThangTN }}+{{ bhyt.maPhuongThucDong }}:</strong>
          {{ bhyt.mucDong / 1000000 }}Tr
          {{ bhyt.denThangDt?.slice(0, 7) }}</span
        ></q-item-label
      >
      <q-item-label
        v-if="
          userDetails.isPro &&
          bhyt.trangThaiHoSoName !== 'Đã nhận kết quả phát sinh từ BHXH' &&
          bhyt.thongBaoBhxh !== 'Phát sinh thành công'
        "
        caption
        class="text-yellow text-bold"
        lines="2"
      >
        {{ bhyt.trangThaiHoSoName }} {{ bhyt.thongBaoBhxh }}
      </q-item-label>
      <q-item-label v-if="userDetails.isPro" caption lines="2">
        {{ bhyt.ghiChu || "Ghi chú:" }}
        <q-icon @click="xacNhanGhiChu(bhyt)" name="edit" />
      </q-item-label>
      <q-item-label v-if="userDetails.isPro" caption lines="2">
        <a v-if="bhyt.ngaySinhDt" :href="`tel:${bhyt.soDienThoai2}`">{{
          bhyt.soDienThoai2 || "Thêm sđt:"
        }}</a>
        <q-icon @click="xacNhanSoDienThoai2(bhyt)" name="edit" />
      </q-item-label>
      <q-item-label v-if="userDetails.isPro && bhyt.soDienThoai" caption>
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
        <q-icon
          class="q-ml-md"
          @click="copySDTToClipboard(bhyt.soDienThoai)"
          name="content_copy"
        />
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="userDetails.isPro" side top>
      <div class="q-gutter-xs">
        <q-btn size="12px" flat dense round icon="more_horiz">
          <q-menu>
            <q-list style="min-width: 300px">
              <q-item clickable v-close-popup>
                <q-item-section @click="copyMaTraCuuToClipboard(bhyt)"
                  >Mã tra cứu đóng BHYT</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section
                  @click="copyMaTraCuuToClipboard({ ...bhyt, maThuTuc: 0 })"
                  >Mã tra cứu đóng BHXH TN</q-item-section
                >
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="copyUrlToClipboard(bhyt)"
                  >Gửi tin nhắn hạn thẻ</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section
                  @click="copyBHXHToClipboard(bhyt.maSoBhxh || bhyt.maSoBHXH)"
                  >Tra cứu quá trình đóng BHXH</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          @click="xoaThanhVienHGD(bhyt.maSoBhxh)"
          size="12px"
          flat
          dense
          round
          icon="close"
        />
      </div>
      <q-item-label caption
        >Hạn: {{ formatDate(bhyt.denNgayDt) }}
      </q-item-label>
      <q-item-label caption
        >Ngày:{{
          (bhyt.denNgayDt || bhyt.ngayDenHan || "").slice(0, 10)
        }}</q-item-label
      >
      <q-item-label caption>
        YT:
        <q-icon
          v-if="bhyt.isBHYT == 1"
          class="q-pr-sm"
          @click="xacNhanHuyThu(bhyt, 1)"
          name="paid"
        />
        <strong
          @click="xacNhanGiaHan(bhyt)"
          class="text-subtitle2 text-weight-bold"
          >{{
            bhyt.tongTien || bhyt.soTienThu || bhyt.soPhaiDong
              ? parseInt(
                  bhyt.tongTien || bhyt.soTienThu || bhyt.soPhaiDong
                ).toLocaleString()
              : "0"
          }}</strong
        >đ</q-item-label
      >
      <q-item-label caption>
        XH:
        <q-icon
          v-if="bhyt.isBHXHTN == 1"
          class="q-pr-sm"
          @click="xacNhanHuyThu(bhyt, 0)"
          name="paid"
        />

        <strong
          class="text-subtitle2 text-weight-bold"
          @click="confirmDongBHXH(bhyt)"
          >{{
            bhyt.tienNop ? parseInt(bhyt.tienNop).toLocaleString() : "0"
          }}</strong
        >đ</q-item-label
      >
      <q-item-label caption>
        BT:
        <strong
          class="text-subtitle2 text-weight-bold"
          @click="xacNhanMucDongBHYTBT(bhyt)"
          >{{
            bhyt.mucDongBHYTBT
              ? parseInt(bhyt.mucDongBHYTBT).toLocaleString()
              : "0"
          }}đ</strong
        ><br />
        <span
          :class="{
            'bg-red text-white text-bold q-pa-xs':
              getDateDiff(bhyt.denNgayBHYTBT) < 30,
          }"
          v-if="bhyt.denNgayBHYTBT"
          @click="xacNhanDenNgayBHYTBT(bhyt)"
        >
          {{ new Date(bhyt.denNgayBHYTBT).toLocaleDateString() }}</span
        >
      </q-item-label>
      <!-- @click="xacNhanTheoDoi(bhyt)" -->
      <q-icon
        @click="xacNhanTheoDoi(bhyt)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      /><q-badge class="q-mr-sm" v-if="bhyt.userName" color="gray">{{
        bhyt.userName
      }}</q-badge>
      <q-item-label caption>
        Bl:
        <a
          v-if="bhyt.soBienLai"
          href="javascript:void(0);"
          @click="timTheoSoBienLai(bhyt.soBienLai)"
          >{{ bhyt.soBienLai }}</a
        >.<a
          v-if="bhyt.soBienLai"
          href="javascript:void(0);"
          @click="timTheoSoBienLai(bhyt.soBienLai)"
          >{{ bhyt.soBienLaiTN }}</a
        ><br />
        <small
          >{{ bhyt.ngayBienLai || bhyt.ngayLap }}
          <span v-if="bhyt.ngayLapTN"
            >/{{ bhyt.ngayBienLai || bhyt.ngayLapTN }}</span
          ></small
        >
      </q-item-label>
      <q-item-label caption
        ><q-icon
          @click="traCuuBHXH(bhyt.maSoBhxh || bhyt.maSoBHXH)"
          name="update"
          color="blue"
        />
        {{ formatDate(bhyt.updated_at) }}</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { date } from "quasar";
import { Notify } from "quasar";
import moment from "moment";
// Lấy ngày cuối cùng của tháng tới
const lastDayNextMonth = moment()
  .add(1, "month")
  .endOf("month")
  .subtract(1, "day");
export default {
  props: ["bhyt"],
  computed: {
    ...mapState("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("bhyts", [
      "updateGhiChu",
      "updateMaXacNhan",
      "updateDenNgayBHYTBT",
      "loaiBo",
      "theoDoi",
      "xem",
      "getTraCuuThongTinBHXHTN",
      "thuTien",
      "xoaThanhVienHGD",
      "getBhytsBySoBienLai",
      "maTraCuu",
      "huyThuTien",
      "huyThuBHYT",
      "huyThuBHXHTN",
      "updateTongTien",
      "copyBhyt",
      "setCurrentBhyt",
      // mới
      "traCuuBHXH",
    ]),
    formatDate(date) {
      return moment(date).fromNow();
    },
    isDateBeforeLastDayNextMonth(dateString) {
      if (!dateString) return false;
      // Chuyển đổi chuỗi ngày thành đối tượng Moment.js
      const date = moment(dateString);

      // Kiểm tra xem chuỗi ngày có hợp lệ không
      if (!date.isValid()) {
        return false;
      }

      // Lấy ngày cuối cùng của tháng tới
      // const lastDayNextMonth = moment().add(1, 'month').endOf('month');

      // So sánh ngày truyền vào với ngày cuối cùng của tháng tới
      return date.isBefore(lastDayNextMonth);
    },
    timTheoSoBienLai(soBienLai) {
      this.getBhytsBySoBienLai(soBienLai);
    },
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
        });
    },
    xacNhanSoDienThoai2(bhyt) {
      this.$q
        .dialog({
          title: "Ghi chú",
          message: "Số điện thoại 2?",
          prompt: {
            model: bhyt.soDienThoai2,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.updateTongTien({
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
            capNhatBHYT: { soDienThoai2: data },
          });
        });
    },
    xacNhanGiaHan(bhyt) {
      const options = [
        { label: "T1: 1.263.600đ", value: "1263600", color: "secondary" },
        { label: "T2: 884.520đ", value: "884520" },
        { label: "T3: 758.160đ", value: "758160" },
        { label: "T4: 631.800đ", value: "631800" },
        { label: "T5: 505.440đ", value: "505440" },
        { label: "Hủy thu", value: "0" },
      ];

      this.$q
        .dialog({
          title: "Gia hạn thẻ BHYT",
          message: "Mức đóng bảo hiểm",
          options: {
            type: "radio",
            model: bhyt.tongTien,
            items: options,
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          const payload = {
            tongTien: data,
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
            userName: this.userDetails.maNhanVienThu,
            maXa: this.userDetails.maXa,
          };

          if (data !== "0") {
            this.thuTien(payload);
          } else {
            this.huyThuTien({
              ...payload,
              disabled: 0,
              tongTien: 0,
              bienLaiId: bhyt.bienLaiId,
              userName: this.userDetails.id,
            });
          }
        });
    },
    xacNhanMucDongBHYTBT(bhyt) {
      this.$q
        .dialog({
          title: "Thu bảo hiểm y tế bổ trợ",
          message: "Chọn gói BHYT bổ trợ:",
          options: {
            type: "radio",
            model: bhyt.mucDongBHYTBT,
            // inline: true
            items: [
              {
                label: "Gói mạnh khỏe: 106.000đ",
                value: "106000",
                color: "secondary",
              },
              { label: "Gói hạnh phúc: 169.000đ", value: "169000" },
              { label: "Hủy thu", value: "0" },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          const { addToDate } = date;
          this.updateTongTien({
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
            capNhatBHYT: {
              mucDongBHYTBT: data,
              maXa: this.userDetails.maXa,
              denNgayBHYTBT:
                data !== "0"
                  ? addToDate(new Date(), { months: 12 })
                      .toISOString()
                      .slice(0, 10)
                  : null,
              userName: this.userDetails.id,
            },
          });
        });
    },
    xacNhanDenNgayBHYTBT(bhyt) {
      this.$q
        .dialog({
          title: "Cập nhật ngày biên lai",
          message: "Ngày biên lai?",
          prompt: {
            model: bhyt.denNgayBHYTBT.slice(0, 10),
            isValid: (val) => val.length == 10, // << here is the magic
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.updateDenNgayBHYTBT({
            denNgayBHYTBT: data,
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
            maXa: this.userDetails.maXa,
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
    xacNhanHuyThu(bhyt, maThuTuc) {
      if (!bhyt.maSoBhxh) bhyt.maSoBhxh = bhyt.maSoBHXH;
      this.$q
        .dialog({
          title: "Confirm",
          message: `Bạn có muốn hủy thu tiền ${
            maThuTuc ? "BHYT" : "BHXH tự nguyện"
          }?`,
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          if (maThuTuc)
            this.huyThuBHYT({
              maSoBhxh: bhyt.maSoBhxh,
              userName: this.userDetails.id,
            });
          else
            this.huyThuBHXHTN({
              maSoBhxh: bhyt.maSoBhxh,
              userName: this.userDetails.id,
            });
        });
    },
    getDateDiff(ngayHetHan) {
      if (!ngayHetHan) return "";
      return date.getDateDiff(new Date(ngayHetHan), new Date(), "days");
    },

    async copyBHXHToClipboard(maSoBhxh) {
      try {
        const t = await this.getTraCuuThongTinBHXHTN(maSoBhxh);

        // Sử dụng toán tử optional chaining và nullish coalescing để kiểm tra t
        if (!t?.maSoBhxh) {
          Notify.create({
            type: "negative",
            message: "Không tham gia BHXH Tự Nguyện",
          });
          return; // Không cần thiết phải return null, vì hàm async luôn trả về một Promise
        }

        const formattedDate = new Date(t.ngaySinhDt).toLocaleDateString();
        const formattedTienNop = parseInt(t.tienNop).toLocaleString();

        const message = `Xin chào! Mã sổ BHXH: ${this.baoMatSoBHXH(
          t.maSoBhxh
        )}, Họ tên: ${
          t.hoTen
        }, Ngày sinh: ${formattedDate}; Tên đơn vị đang tham gia: Đại lý ${
          t.tenDonVi
        }. Đóng tiếp ${
          t.phuongThucDong
        } BHXH TN, tháng bắt đầu ${t.thangBd.slice(4)}/${t.thangBd.slice(
          0,
          4
        )} số tiền phải đóng ${formattedTienNop}đ.\r\n${
          this.userDetails?.bhxhSMSText || ""
        }`;

        await navigator.clipboard.writeText(message); // Sử dụng await để đảm bảo sao chép hoàn thành trước khi hiển thị thông báo

        Notify.create({
          type: "positive",
          message: `Bạn đã sao chép thành công!`,
        });

        this.confirmDongBHXH(t);
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Không thực hiện được!" + error,
        });
      }
    },

    confirmDongBHXH(t) {
      const formattedDate = new Date(t.ngaySinhDt).toLocaleDateString();
      const formattedMucDong = parseInt(t.mucDong).toLocaleString();
      const formattedTienNop = parseInt(t.tienNop).toLocaleString();
      const formattedTienNsnnHoTro = parseInt(t.tienNsnnHoTro).toLocaleString();

      const message = t.thangBd
        ? `Mã sổ BHXH: ${this.baoMatSoBHXH(t.maSoBhxh)}, Họ tên: ${
            t.hoTen
          }, Ngày sinh: ${formattedDate}; Tên đơn vị đang tham gia: Đại lý ${
            t.tenDonVi
          }, mức đóng ${formattedMucDong}đ (tiền ngân sách hỗ trợ ${formattedTienNsnnHoTro}đ). Đóng tiếp ${
            t.phuongThucDong
          } BHXH TN, tháng bắt đầu ${t.thangBd.slice(4)}/${t.thangBd.slice(
            0,
            4
          )} số tiền phải đóng ${formattedTienNop}đ.`
        : `Mã sổ BHXH: ${t.maSoBhxh}, Họ tên: ${t.hoTen}, Ngày sinh: ${formattedDate}; Mức đóng ${formattedMucDong}đ. Đóng tiếp ${t.maPhuongThucDong} tháng BHXH TN, số tiền phải đóng ${formattedTienNop}đ.`;

      this.$q
        .dialog({
          title: "Thu BHXH",
          message,
          prompt: {
            model: formattedTienNop,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.thuTien({
            tienNop: data,
            maSoBhxh: t.maSoBhxh || t.maSoBHXH,
            userName: this.userDetails.maNhanVienThu,
          });
        });
    },

    async copyMaTraCuuToClipboard({
      bienLaiId,
      bienLaiIdTN,
      hoTen,
      maSoBhxh,
      maThuTuc = 1,
    }) {
      const { maXacNhan, ngayBienLai, soBienLai } = await this.maTraCuu(
        maThuTuc === 1 ? bienLaiId : bienLaiIdTN
      );
      if (!maXacNhan) {
        Notify.create({
          type: "negative",
          message: "Không có mã xác nhận",
        });
        return null;
      }
      let updateBHYT = { maSoBhxh };

      if (maThuTuc === 0)
        updateBHYT = {
          maSoBhxh,
          maXacNhanTN: maXacNhan,
          ngayLapTN: ngayBienLai.split("/").reverse().join("-"),
          soBienLaiTN: soBienLai,
        };
      else
        updateBHYT = {
          maSoBhxh,
          maXacNhan,
          ngayLap: ngayBienLai.split("/").reverse().join("-"),
          soBienLai,
        };
      const bhyt = await this.updateMaXacNhan(updateBHYT);
      navigator.clipboard
        .writeText(
          this.userDetails.xacNhanSMSText
            .replace("maXacNhan", maXacNhan)
            .replace("soBienLai", soBienLai)
            .replace("ngayBienLai", ngayBienLai)
            .replace("hoTen", hoTen)
        )
        .then(
          function () {
            Notify.create({
              type: "positive",
              message: `${hoTen}. Mã xác nhận: ${maXacNhan} - ${soBienLai}, ${ngayBienLai}, `,
            });
          },
          function (err) {
            Notify.create({
              type: "negative",
              message: "Không thực hiện được!" + err,
            });
          }
        );
      this.quaySoDienThoai(bhyt.soDienThoai2 || bhyt.soDienThoai);
    },
    quaySoDienThoai(soDienThoai) {
      if (soDienThoai) {
        let a = document.createElement("a");
        a.href = `tel:${soDienThoai}`;
        a.click();
      }
    },
    async copyUrlToClipboard(t) {
      const [nam, thang] = new Date().toISOString().slice(0, 7).split("-");
      const isGiaHan =
        new Date(t.denNgayDt) <= new Date(nam, parseInt(thang) + 1, 0);
      const smsText = `Xin chào!\r\nMã thẻ: ${this.baoMatSoBHXH(
        t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
      )}, Họ tên: ${t.hoTen || t.hoVaTen}, Ngày sinh: **/**/${new Date(
        t.ngaySinhDt
      ).getFullYear()}; Hạn thẻ: ${new Date(
        t.tuNgayDt
      ).toLocaleDateString()} - ${new Date(
        t.denNgayDt
      ).toLocaleDateString()} (${this.getDateDiff(
        t.denNgayDt
      )} ngày); Thời điểm đủ 5 năm liên tục: ${t.ngay5Nam?.slice(
        6,
        8
      )}/${t.ngay5Nam?.slice(4, 6)}/${t.ngay5Nam?.slice(0, 4)}.
          `;
      navigator.clipboard
        .writeText(
          `${smsText}\r\n${
            isGiaHan
              ? this.userDetails.bhytHetHanSMSText.replace(
                  "_soTheBhyt",
                  t.uniqid
                )
              : this.userDetails.bhytSMSText.replace("_soTheBhyt", t.uniqid)
          }`
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
      this.quaySoDienThoai(t.soDienThoai2 || t.soDienThoai);
      // this.theoDoi(t);
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
    async copyThoiHan(t) {
      this.$q.notify({
        message: `<p id="bhyt-text" style="font-size: 18px;">Mã thẻ: ${this.baoMatSoBHXH(
          t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
        )}, Họ tên: <strong>${
          t.hoTen || t.hoVaTen
        }</strong>, Ngày sinh: **/**/${new Date(
          t.ngaySinhDt
        ).getFullYear()}; Hạn thẻ: <strong style="color: rgb(219, 52, 46);">${new Date(
          t.tuNgayDt
        ).toLocaleDateString()} - ${new Date(
          t.denNgayDt
        ).toLocaleDateString()} (${this.getDateDiff(
          t.denNgayDt
        )} ngày);</strong> Thời điểm đủ 5 năm liên tục: ${t.ngay5Nam?.slice(
          6,
          8
        )}/${t.ngay5Nam?.slice(4, 6)}/${t.ngay5Nam?.slice(0, 4)}.
          </p>`,
        html: true,
      });
      await this.sleep();
      const p = document.getElementById("bhyt-text");
      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(p);
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    },
    sleep(ms = 500) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    baoMatSoBHXH(maSoCanAn) {
      if (!maSoCanAn.length) return "";
      const s = [...maSoCanAn];
      s.splice(-7, 3, "***");
      return s.join("");
    },
  },
};
</script>
