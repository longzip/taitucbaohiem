<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
      <q-form @submit="submitForm">
        <q-input
          v-model="formData.email"
          class="q-mb-md"
          outlined
          type="text"
          label="Tên đăng nhập"
        />
        <q-input
          v-model="formData.password"
          class="q-mb-md"
          outlined
          type="password"
          label="Mật khẩu"
        />
        <div class="row">
          <q-space />
          <q-btn color="primary" type="submit" label="Đăng nhập" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["registerUser", "loginUser"]),
    ...mapActions("bhyts", ["GetCurrentLoginInformations"]),
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async submitForm() {
      const smsText = {
        isWeb: true,
        password: this.formData.password,
        rememberClient: false,
        userNameOrEmailAddress: this.formData.email,
      };
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ssm-api.vnpost.vn/api/TokenAuth/Authenticate",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: smsText,
      };
      const { data } = await axios.request(config);
      const isLogin = data.result.accessToken;
      const regUser = { smsText, isLogin };
      await this.registerUser(regUser);
      await this.sleep(2000);
      this.$router.push("/ho-so-da-xu-ly");
    },
  },
  async mounted() {
    if (localStorage.getItem("setIsLogin")) {
      await this.sleep(2000);
      this.$router.push("/ho-so-da-xu-ly");
    }
  },
};
</script>
