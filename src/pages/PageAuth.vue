<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-center">
        <div class="col-md-6">
          <q-card class="q-pa-md">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="login" label="Đăng nhập" />
              <q-tab name="register" label="Đăng ký" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="login">
                <login-register :tab="tab" />
              </q-tab-panel>

              <q-tab-panel name="register">
                <login-register :tab="tab" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: "login",
    };
  },
  components: {
    "login-register": require("components/LoginRegister.vue").default,
  },
};
</script>
