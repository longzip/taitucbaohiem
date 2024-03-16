<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-form @submit="luuThongTin" class="q-gutter-md">
        <q-input
          v-model="formData.maTinh"
          class="q-mb-md"
          outlined
          type="text"
          label="Mã tỉnh"
        />
        <q-input
          v-model="formData.maHuyen"
          class="q-mb-md"
          outlined
          type="text"
          label="Mã huyện"
        />
        <q-input
          v-model="formData.maXa"
          class="q-mb-md"
          outlined
          type="text"
          label="Mã xã"
        />

        <q-input
          v-model="formData.bhytSMSText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu tin nhắn BHYT"
        />
        <q-input
          v-model="formData.bhytHetHanSMSText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu tin nhắn BHYT hết hạn"
        />
        <q-input
          v-model="formData.xacNhanSMSText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu tin nhắn xác nhận đóng tiền"
        />
        <q-input
          v-model="formData.bhxhSMSText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu tin nhắn BHXH"
        />
        <q-input
          v-model="formData.guiHangSMSText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu tin nhắn gửi hàng bưu điện."
        />

        <div>
          <q-btn label="Cập nhật" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      formData: {
        name: "Bưu điện xã Tự Lập",
        email: "info@buudienxatulap.ga",
        smsText: "sss",
        isLogin: "",
        bhytSMSText: "",
        bhytHetHanSMSText: "",
        bhxhSMSText: "",
        xacNhanSMSText: "",
        guiHangSMSText: "",
        maXa: "",
        maTinh: "000",
        maHuyen: "000",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("auth", ["firebaseUpdateUserAll"]),
    luuThongTin() {
      if (this.formData.maXa)
        this.$q
          .dialog({
            title: "Xác nhận",
            message: "Bạn có muốn lưu thông tin cấu hình",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.firebaseUpdateUserAll({
              userId: this.userDetails.userId,
              updates: this.formData,
            });
          });
      else this.formData = { ...this.userDetails };
    },
  },
  created() {
    this.formData = { ...this.userDetails };
  },
};
</script>
