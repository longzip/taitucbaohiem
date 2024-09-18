<template>
  <q-card>
    <q-card-section class="row items-center q-pb-lg">
      <div class="text-h6">Cập nhật thông tin BHYT</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-form @submit="submit" class="q-gutter-md">
        <q-input
          v-model="form.maPhuongThucDong"
          label="Phương thức đóng (1,3,6,12 tháng)"
        />
        <q-input v-model="form.mucDong" label="Mức thu nhập lựa chọn" />
        <q-input v-model="form.denThangDt" type="date" label="Đến tháng" />
        <q-btn type="submit" label="Lưu" color="primary" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "BhytUpdateDialog",
  computed: {
    ...mapGetters("bhyts", ["getCurrentBhyt"]),
    form() {
      // Sử dụng getCurrentBhyt từ Vuex để tạo data cho form
      return {
        maSoBhxh: this.getCurrentBhyt.maSoBhxh,
        mucDong: this.getCurrentBhyt.mucDong,
        maPhuongThucDong: this.getCurrentBhyt.maPhuongThucDong,
        denThangDt: this.getCurrentBhyt.denThangDt,
        // ... Các trường khác cần cập nhật
      };
    },
  },
  methods: {
    ...mapActions("bhyts", ["setCurrentBhyt", "updateDenNgayBHXH"]),
    async submit() {
      await this.updateDenNgayBHXH(this.form);

      this.setCurrentBhyt(null);
    },
  },
};
</script>
