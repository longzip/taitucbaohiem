<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
// import axios from "axios";
export default defineComponent({
  name: "App",
  methods: {
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
  },
  computed: {
    ...mapGetters("auth", ["isLogin", "userDetails"]),
  },
  async mounted() {
    await this.handleAuthStateChanged();
  },
});
</script>
