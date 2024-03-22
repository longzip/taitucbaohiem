<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab == 'register'"
      v-model="formData.name"
      class="q-mb-md"
      outlined
      label="Họ Tên"
    />
    <q-input
      v-model="formData.email"
      class="q-mb-md"
      outlined
      type="email"
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
      <q-btn color="primary" type="submit" :label="tab" />
    </div>
  </q-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["tab"],
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["registerUser", "loginUser"]),
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async submitForm() {
      if (this.tab == "login") {
        await this.loginUser(this.formData);
      }
      await this.sleep(1000);
      this.$router.push("/");
    },
  },
  mounted() {
    // console.log(localStorage.getItem("setIsLogin"));
    if (localStorage.getItem("setIsLogin")) this.$router.push("/");
  },
};
</script>
