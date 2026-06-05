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

        <q-toolbar-title>Tái tục bảo hiểm LWS</q-toolbar-title>

        <q-btn
          round
          color="primary"
          icon="logout"
          @click="logoutUser"
          :to="'/dang-nhap-ssm'"
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
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://www.longwebstudio.net/"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Phát triển ứng dụng</q-item-label>
            <q-item-label caption>LONG WEB STUDIO</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://zalo.me/g/xvacnz843"
        >
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Hỗ Trợ 0374638603</q-item-label>
            <q-item-label caption>Tham gia nhóm ZALO</q-item-label>
          </q-item-section>
        </q-item>
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
    title: "Tra cứu BHYT",
    caption: "Theo Tên, Mã thẻ, số đt",
    icon: "search",
    link: "/",
  },
  {
    title: "Người tham gia BHXH tự nguyện",
    caption: "Tra cứu theo Mã số BHXH",
    icon: "find_in_page",
    link: "/tra-cuu-ho-so",
  },
  {
    title: "Tái tục MIC",
    caption: "Quản lý tái tục MIC",
    icon: "autorenew",
    link: "/mic",
  },
  {
    title: "Bảo hiểm TNDS",
    caption: "Quản lý bảo hiểm TNDS",
    icon: "directions_car",
    link: "/tnds",
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
