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
    title: "Tra khách hàng EVN",
    caption: "Theo Tên, số đt, địa chỉ",
    icon: "payment",
    link: "/evn",
  },
  {
    title: "Tra khách hàng EVN2",
    caption: "Theo Tên, số đt, địa chỉ",
    icon: "payment",
    link: "/evn2",
  },
  {
    title: "KHL",
    caption: "Theo Tên, số đt, địa chỉ",
    icon: "book",
    link: "/khl",
  },
  {
    title: "Khách hàng Woocomer",
    caption: "Theo Tên, số đt, địa chỉ",
    icon: "contact_mail",
    link: "/customer",
  },
  {
    title: "Tái tục",
    caption: "DS BHYT tái tục",
    icon: "history",
    link: "/tai-tuc",
  },
  {
    title: "Đã hết hạn",
    caption: "DS BHYT đã hết hạn",
    icon: "alarm_off",
    link: "/het-han",
  },
  {
    title: "Tra cứu",
    caption: "Tìm theo mã BHXH",
    icon: "perm_identity",
    link: "/tra-cuu",
  },
  {
    title: "Tìm kiếm",
    caption: "Tìm theo họ tên",
    icon: "person_search",
    link: "/tim-kiem",
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
    title: "Đang theo dõi",
    caption: "Mã số BHXH đang theo dõi",
    icon: "star",
    link: "/theo-doi",
  },
  {
    title: "Danh sách khách hàng tái tục BHYT",
    caption: "Danh sách khách hàng chưa nộp",
    icon: "contact_page",
    link: "/khach-hang-chua-nop",
  },
  {
    title: "Danh sách khách hàng tái tục BHXH",
    caption: "Danh sách khách hàng chưa nộp",
    icon: "contact_page",
    link: "/khach-hang-tai-tuc-bhxh",
  },
  {
    title: "Ngừng theo dõi",
    caption: "Mã số BHXH ngừng hoạt động",
    icon: "do_not_disturb_on",
    link: "/ngung-hoat-dong",
  },
  {
    title: "Chưa có dữ liệu",
    caption: "Mã số BHXH chưa cập nhật",
    icon: "sync",
    link: "/dong-bo",
  },
  {
    title: "Cài đặt",
    caption: "Thông tin người dùng",
    icon: "settings",
    link: "/settings",
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
