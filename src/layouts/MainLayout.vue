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

        <q-toolbar-title>BHXH và BHYT</q-toolbar-title>

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
    title: "Tìm kiếm",
    caption: "Theo Tên, Mã thẻ, số đt",
    icon: "search",
    link: "/",
  },
  {
    title: "Khách hàng lớn",
    caption: "Theo Tên, số đt, địa chỉ",
    icon: "payment",
    link: "/khl2",
  },
  {
    title: "Danh sách đơn hàng",
    caption: "Theo dõi bưu gửi",
    icon: "payment",
    link: "/items",
  },
  {
    title: "Hồ sơ chưa xử lý",
    caption: "Các hồ sơ chưa xử lý",
    icon: "timer",
    link: "/ho-so-chua-xu-ly",
  },
  {
    title: "Hồ sơ đã nộp BDH",
    caption: "Các hồ sơ đã nộp",
    icon: "verified",
    link: "/ho-so-da-nop",
  },
  {
    title: "Hồ sơ đã xử lý",
    caption: "Các hồ sơ đã xử lý",
    icon: "verified",
    link: "/ho-so-da-xu-ly",
  },
  {
    title: "Long Web Studio",
    caption: "Phát triển ứng dụng",
    icon: "code",
    link: "https://www.facebook.com/longwebstudio",
  },
  {
    title: "Hỗ Trợ",
    caption: "Lỗ Văn Long",
    icon: "help",
    link: "https://www.facebook.com/lovanlongvn",
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
