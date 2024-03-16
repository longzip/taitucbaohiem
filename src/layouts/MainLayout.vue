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

        <q-toolbar-title>BHXH tự nguyện và BHYT</q-toolbar-title>

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
          href="https://www.facebook.com/longwebstudio"
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
          href="https://www.facebook.com/lovanlongvn"
        >
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Hỗ Trợ</q-item-label>
            <q-item-label caption>Lỗ Văn Long</q-item-label>
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
    title: "Tra cứu",
    caption: "Theo Tên, Mã thẻ, số đt",
    icon: "search",
    link: "/",
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
