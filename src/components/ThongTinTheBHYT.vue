<template>
  <q-item
    :class="{
      'bg-warning': bhyt.coTheUuTienCaoHon,
      'bg-positive': getDateDiff(bhyt.denNgayDt) > 30,
      'bg-blue-grey-3': getDateDiff(bhyt.denNgayDt) < 1,
    }"
  >
    <q-item-section>
      <q-item-label
        ><q-icon
          :class="bhyt.gioiTinh == 1 ? 'text-pink' : 'text-primary'"
          :name="bhyt.gioiTinh == 1 ? 'female' : 'male'" />{{ bhyt.hoTen }}
        {{ bhyt.ngaySinhDt }}

        <q-icon
          @click="xacNhanLoaiBo(bhyt)"
          :name="bhyt.disabled == 1 ? 'do_not_disturb_on' : 'delete_forever'"
          :color="bhyt.disabled == 1 ? 'red' : 'gray'"
      /></q-item-label>
      <q-item-label caption lines="2">
        Mã hộ:<a
          target="_blank"
          :href="`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/ho-gia-dinh/${bhyt.maHoGd}`"
          >{{ bhyt.maHoGd }}</a
        >
      </q-item-label>
      <q-item-label caption lines="2"
        ><a
          target="_blank"
          :href="`https://www.buudienxatulap.ga/wordpress/wp-pwa/#/tra-cuu?q=${bhyt.soTheBhyt}`"
          >{{ bhyt.soTheBhyt ? bhyt.soTheBhyt : bhyt.maSoBhxh }}</a
        >
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.maKCB }}</q-item-label>
      <q-item-label caption lines="2">5 năm:{{ bhyt.ngay5Nam }}</q-item-label>

      <q-item-label caption lines="2">
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption
        >{{ getDateDiff(bhyt.denNgayDt) }} ngày</q-item-label
      >
      <q-item-label caption>Đến:{{ bhyt.denNgayDt }}</q-item-label>
      <q-icon
        @click="xacNhanTheoDoi(bhyt)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      />
      <q-item-label caption
        >Cập nhật:{{
          new Date(bhyt.updated_at).toLocaleDateString()
        }}</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";
import { date } from "quasar";
export default {
  props: ["bhyt"],
  methods: {
    ...mapActions("bhyts", ["loaiBo", "theoDoi"]),
    xacNhanLoaiBo(bhyt) {
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
      return date.getDateDiff(new Date(ngayHetHan), new Date(), "days");
    },
  },
};
</script>
