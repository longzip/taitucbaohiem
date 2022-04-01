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
  },
  computed: {
    ...mapGetters("auth", ["isLogin"]),
  },
  async mounted() {
    await this.handleAuthStateChanged();
  },
});
</script>
