<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default defineComponent({
  name: "App",
  methods: {
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
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

      await this.firebaseUpdateUser({
        userId: this.userDetails.userId,
        updates: { ...this.userDetails, isLogin: data.result.accessToken },
      });
      await this.handleAuthStateChanged();
      const expirationDate = new Date(new Date().getTime() + 12 * 60 * 1000);
      localStorage.setItem("expiration", expirationDate.toISOString());
    },
  },
  computed: {
    ...mapGetters("auth", ["isLogin", "userDetails"]),
  },
  async mounted() {
    await this.handleAuthStateChanged();
    const expirationDate = localStorage.getItem("expiration");
    if (!expirationDate || new Date(expirationDate) < new Date()) {
      console.log("tao khoa mới!");
      await this.taoKhoaMoi();
    }
  },
});
</script>
