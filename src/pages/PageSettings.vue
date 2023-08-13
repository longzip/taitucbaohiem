<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-form @submit="luuThongTin" class="q-gutter-md">
        <!-- <q-input
          filled
          v-model="formData.name"
          label="Tên của bạn *"
          hint="Tên hoặc họ và tên"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Vui lòng cho biết tên của bạn',
          ]"
        /> -->
        <!-- <q-input
          v-model="formData.email"
          class="q-mb-md"
          outlined
          type="email"
          label="Tên đăng nhập"
          disable
        /> -->
        <!-- <q-input
          v-model="formData.smsText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu gửi tin SMS"
        /> -->
        <q-icon name="update" @click="taoKhoaMoi({})" />
        <q-input
          v-model="formData.isLogin"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Khóa bí mật"
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
import axios from "axios";
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
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("auth", [
      "firebaseUpdateUser",
      "firebaseUpdateUserAll",
      "handleAuthStateChanged",
    ]),
    luuThongTin() {
      if (!this.formData.isLogin) return;
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
          this.handleAuthStateChanged();
        });
    },
    async saveBHYT(ghiChu) {
      const headers = {
        "Content-Type": "application/json",
      };

      const API_URL = "https://app.hotham.vn/api/user-ghi-chu";

      const res = await fetch(API_URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({ ghiChu }),
      });

      const json = await res.json();
      if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
      }
      return json;
    },
    async taoKhoaMoi() {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ssm-api.vnpost.vn/api/TokenAuth/Authenticate",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: this.userDetails.smsText,
      };

      const { data } = await axios.request(config);

      this.formData.isLogin = data.result.accessToken;

      await this.firebaseUpdateUser({
        userId: this.userDetails.userId,
        updates: this.formData,
      });
      await this.handleAuthStateChanged();
      window.location.href = "https://todo.hotham.vn/";
    },
  },
  created() {
    this.formData = { ...this.userDetails };
  },
};
</script>
