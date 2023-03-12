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
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.maKCB }}</q-item-label>
      <q-item-label caption lines="2"
        >5 năm:{{ bhyt.ngay5Nam || bhyt.trangThaiHoSoName || bhyt.moTa }}</q-item-label
      >

      <q-item-label caption lines="2">
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption
        >{{ getDateDiff(bhyt.denNgayDt) }} ngày</q-item-label
      >
      <q-item-label caption
        >Đến:{{ bhyt.denNgayDt || bhyt.ngayDenHan }}</q-item-label
      >
      <q-item-label caption
        >đ
        <strong>{{
          bhyt.tongTien ? parseInt(bhyt.tongTien).toLocaleString() : "0"
        }}</strong></q-item-label
      >
      <q-icon
        @click="xacNhanTheoDoi(bhyt)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      />
      <q-item-label caption
        >{{ bhyt.ngayLap || new Date(bhyt.updated_at).toLocaleString() }}<br />
        {{ bhyt.soBienLai ? `Số: ${bhyt.soBienLai}` : bhyt.ghiChu }}<br />
        {{ bhyt.userName }}
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
    ...mapActions("bhyts", ["loaiBo", "theoDoi", "dongBoDuLieu"]),
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
    copyUrlToClipboard(t) {
      const [nam, thang, ngay] = new Date()
        .toISOString()
        .slice(0, 10)
        .split("-");
      navigator.clipboard
        .writeText(
          new Date(t.denNgayDt) < new Date(nam, parseInt(thang) + 1, 0)
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
          Thẻ đã được gia hạn! Mã thẻ: ${
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
  },
  filters: {
    tien: function (value) {
      if (!value) return "0đ";
      return parseInt(value).toLocaleString();
    },
  },
};
</script>
