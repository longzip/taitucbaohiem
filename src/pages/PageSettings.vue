<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-form @submit="luuThongTin" class="q-gutter-md">
        <q-input
          filled
          v-model="formData.name"
          label="Tên của bạn *"
          hint="Tên hoặc họ và tên"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Vui lòng cho biết tên của bạn',
          ]"
        />
        <q-input
          v-model="formData.email"
          class="q-mb-md"
          outlined
          type="email"
          label="Tên đăng nhập"
          disable
        />
        <q-input
          v-model="formData.smsText"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Mẫu gửi tin SMS"
        />
        <q-input
          v-model="formData.isLogin"
          class="q-mb-md"
          outlined
          type="textarea"
          label="Khóa bí mật"
        />
        <div>
          <q-btn label="Cập nhật" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      formData: {
        name: "Bưu điện xã Tự Lập",
        email: "info@buudienxatulap.ga",
        smsText: "sss",
        isLogin: "a",
      },
    };
  },
  computed: {
    ...mapState("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("auth", ["firebaseUpdateUser", "handleAuthStateChanged"]),
    luuThongTin() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn có muốn lưu thông tin cấu hình",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: this.formData,
          });
          this.handleAuthStateChanged();
        });
    },
    async saveBHYT(ghiChu){
            const headers = {
                'Content-Type': 'application/json'
            }

            const API_URL = 'https://cmsbudientulap.herokuapp.com/api/user-ghi-chu';

            const res = await fetch(API_URL, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ghiChu})
            })

            const json = await res.json()
            if (json.errors) {
                console.error(json.errors)
                throw new Error('Failed to fetch API')
            }
            return json
        },
  },
  mounted() {
    const { isLogin } = this.userDetails;
    if (this.$route.query.q) {
      this.formData.isLogin = this.$route.query.q;
      this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: this.formData,
          });
      this.handleAuthStateChanged();
      this.saveBHYT(this.$route.query.q);
    }
    else this.formData.isLogin = isLogin;
    // this.formData = { name, email, smsText, isLogin };
  },
};
</script>
