<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
export default defineComponent({
  name: "App",
  methods: {
    ...mapActions("auth", ["handleAuthStateChanged"]),
    // ...mapActions("vaccines", ["getAllVaccines"])
    async dangNhap() {
      await this.handleAuthStateChanged();
      if (!this.isLogin) this.$router.replace("/auth");

      //this.$router.replace("/settings");
    },
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
  },
  mounted() {
    this.dangNhap();
  },
});
</script>
