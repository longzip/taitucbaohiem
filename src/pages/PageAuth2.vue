<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-center">
        <div class="col-md-6">
          <q-card class="q-pa-md">
            <q-form @submit="submitForm" class="q-gutter-md">
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
              <div class="text-center q-mt-lg">
                <q-btn color="primary" type="submit" label="Đăng nhập" />
              </div>
            </q-form>
          </q-card>
        </div>
      </div>
    </div>
  </div>
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
      const regUser = {
        smsText,
        isLogin,
      };
      await this.registerUser(regUser);
      await this.sleep(2000);
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.sleep(2000);
    if (localStorage.getItem("setIsLogin")) {
      this.$router.push("/");
    }
  },
};
</script>
