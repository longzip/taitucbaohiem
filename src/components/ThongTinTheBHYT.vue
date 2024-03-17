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
        Tờ khai:<a
          target="_blank"
          :href="`https://app.hotham.vn/thanh-vien-ho-gia-dinh-by/${bhyt.uniqid}/pdf`"
          >{{ bhyt.uniqid }}</a
        >
      </q-item-label>
      <q-item-label caption lines="2">
        Số CMND: {{ bhyt.soCmnd }}
      </q-item-label>
      <q-item-label caption lines="2"
        >{{ bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH }}
        <q-icon
          class="q-ml-md"
          @click="
            copyTextToClipboard(
              bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh || bhyt.maSoBHXH
            )
          "
          name="content_copy"
        />

        <a :href="`tel:${bhyt.soDienThoai}`"
          ><q-icon
            class="q-ml-md"
            @click="copyUrlToClipboard(bhyt)"
            name="share"
        /></a>
        <q-icon
          class="q-ml-md"
          @click="copyMaTraCuuToClipboard(bhyt)"
          name="history"
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
      <q-item-label caption lines="2"
        >Mã xác nhận:{{ bhyt.maXacNhan }}</q-item-label
      >
      <q-item-label v-if="bhyt.isBHXHTN == '1'" caption lines="2"
        ><strong>BHXH {{ bhyt.maPhuongThucDong }}:</strong> {{ bhyt.mucDong }} -
        {{ bhyt.denThangDt.slice(0, 7) }}</q-item-label
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
        ><span @click="capNhapNgayBienLai(bhyt)">{{
          bhyt.ngayLap || bhyt.ngayBienLai || bhyt.updated_at
        }}</span>
        <br />
        <a
          v-if="bhyt.soBienLai"
          href="javascript:void(0);"
          @click="timTheoSoBienLai(bhyt.soBienLai)"
          >{{ bhyt.soBienLai }}</a
        >
        <br />
        <q-badge v-if="bhyt.userName" color="gray">{{ bhyt.userName }}</q-badge>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { date } from "quasar";
import { Notify } from "quasar";
export default {
  props: ["bhyt"],
  computed: {
    ...mapState("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("bhyts", [
      "updateGhiChu",
      "updateMaXacNhan",
      "updateNgayLap",
      "loaiBo",
      "theoDoi",
      "dongBoDuLieu",
      "getTraCuuThongTinBHXHTN",
      "thuTien",
      "xoaThanhVienHGD",
      "getBhytsBySoBienLai",
      "maTraCuu",
    ]),
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
              { label: "T1: 972.000đ", value: "972000", color: "secondary" },
              { label: "T2: 680.400đ", value: "680400" },
              { label: "T3: 583.200đ", value: "583200" },
              { label: "T4: 486.000đ", value: "486000" },
              { label: "T5: 388.800đ", value: "388800" },
              { label: "Không", value: "0" },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.thuTien({
            tongTien: data,
            maSoBhxh: bhyt.maSoBhxh || bhyt.maSoBHXH,
            userName:
              data !== "0"
                ? this.userDetails.maNhanVienThu
                : this.userDetails.id,
            disabled: data !== "0" ? 1 : 0,
          });
        });
    },
    capNhapNgayBienLai(bhyt) {
      this.$q
        .dialog({
          title: "Cập nhật ngày biên lai",
          message: "Ngày biên lai?",
          prompt: {
            model: bhyt.ngayLap,
            isValid: (val) => val.length == 10, // << here is the magic
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.updateNgayLap({
            ngayLap: data,
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
        const t = await this.getTraCuuThongTinBHXHTN(maSoBhxh);
        if (Object.keys(t).length === 0) {
          Notify.create({
            type: "negative",
            message: "Không tham gia BHXH Tự Nguyện",
          });
          return null;
        }
        // this.taoNhacHenBHXHTN(t);
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
            ).toLocaleDateString()}; Tên đơn vị đang tham gia: Đại lý ${
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
            ).toLocaleString()}đ.\r\n` + this.userDetails.bhxhSMSText
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
            ).getFullYear()}; Tên đơn vị đang tham gia: Đại lý ${
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
              isBHXHTN: 1,
              userName: "_" + this.userDetails.maNhanVienThu,
            });
          });
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Không thực hiện được!" + error,
        });
      }
    },
    async copyMaTraCuuToClipboard({ bienLaiId, hoTen, maSoBhxh }) {
      const { maXacNhan, ngayBienLai, soBienLai } = await this.maTraCuu(
        bienLaiId
      );
      if (!maXacNhan) {
        Notify.create({
          type: "negative",
          message: "Không có mã xác nhận",
        });
        return null;
      }
      await this.updateMaXacNhan({
        maSoBhxh,
        maXacNhan,
        ngayLap: ngayBienLai.split("/").reverse().join("-"),
      });
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
              )}/${t.ngay5Nam.slice(4, 6)}/${t.ngay5Nam.slice(0, 4)}.\r\n
          ` +
                this.userDetails.bhytHetHanSMSText.replace(
                  "_soTheBhyt",
                  t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
                )
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
              )}/${t.ngay5Nam.slice(4, 6)}/${t.ngay5Nam.slice(0, 4)}. \r\n
          ` +
                this.userDetails.bhytSMSText.replace(
                  "_soTheBhyt",
                  t.soTheBhyt ? t.soTheBhyt : t.maSoBhxh || t.maSoBHXH
                )
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
