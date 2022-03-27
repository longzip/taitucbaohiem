<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Gọi BHYT </q-toolbar-title>

        <q-btn
          round
          color="primary"
          icon="logout"
          @click="logoutUser"
          :to="'/auth'"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Các chức năng </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapActions } from "vuex";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Trang chủ",
    caption: "Đến hạn BHYT",
    icon: "school",
    link: "/",
  },
  {
    title: "Tra cứu",
    caption: "Tìm theo mã BHXH",
    icon: "search",
    link: "tra-cuu",
  },
  {
    title: "Tìm kiếm",
    caption: "Tìm theo họ tên",
    icon: "search",
    link: "tim-kiem",
  },
  {
    title: "Phát sinh",
    caption: "Mã số BHXH phát sinh",
    icon: "search",
    link: "phat-sinh",
  },
  {
    title: "Cài đặt",
    caption: "Thông tin người dùng",
    icon: "settings",
    link: "settings",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
  },
});
</script>
