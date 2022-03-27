<template>
  <q-item>
    <q-item-section>
      <q-item-label
        ><q-icon
          :class="bhyt.gioiTinh == 1 ? 'text-pink' : 'text-primary'"
          :name="bhyt.gioiTinh == 1 ? 'female' : 'male'" />{{ bhyt.hoTen }}
        {{ bhyt.ngaySinhDt }}

        <q-icon
          @click="loaiBo(bhyt.maSoBhxh)"
          :name="bhyt.disabled == 1 ? 'do_not_disturb_on' : 'delete_forever'"
          :color="bhyt.disabled == 1 ? 'red' : 'gray'"
      /></q-item-label>
      <q-item-label caption lines="2">
        Mã hộ:<router-link :to="`/ho-gia-dinh/${bhyt.maHoGd}`">{{
          bhyt.maHoGd
        }}</router-link>
      </q-item-label>
      <q-item-label caption lines="2">{{ bhyt.soTheBhyt }}</q-item-label>
      <q-item-label caption lines="2">5 năm:{{ bhyt.ngay5Nam }}</q-item-label>

      <q-item-label caption lines="2">
        <a :href="`tel:${bhyt.soDienThoai}`">{{ bhyt.soDienThoai }}</a>
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label caption>{{ bhyt.denNgayDt }}</q-item-label>
      <q-icon
        @click="theoDoi(bhyt.maSoBhxh)"
        name="star"
        :color="bhyt.completed == 1 ? 'yellow' : 'gray'"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: ["bhyt"],
  methods: {
    loaiBo(maSoBhxh) {
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
          console.log("Loại bỏ:" + maSoBhxh);
        });
    },
    theoDoi(maSoBhxh) {
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
          console.log("Theo dõi:" + maSoBhxh);
        });
    },
  },
};
</script>
