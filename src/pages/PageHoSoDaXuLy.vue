<template>
  <q-page>
    <ListHeader bgcolor="bg-orange-4"
      ><q-btn
        rounded
        color="primary"
        label="Tháng trước"
        @click="xemThangTruoc()"
        icon="arrow_back"
      />
      {{ bhyts.length }} Hồ Sơ Đã Xử Lý ({{ tham.toLocaleString() }}-{{
        tongTien.toLocaleString()
      }}đ) / Đã nộp BHYT: {{ daNopBHYT.toLocaleString() }} - Đã nộp BHXH:
      {{ daNopBHXH.toLocaleString() }}
      <q-btn rounded color="primary" @click="dongBo()" icon="sync" />
      <q-btn
        rounded
        color="primary"
        @click="copyTextToClipboard()"
        icon="content_copy"
      />
      <q-btn rounded color="primary" @click="download()" icon="download" />
      <q-btn rounded color="primary" @click="truocKhiInBHYT" icon="print" />
      <q-btn rounded color="primary" @click="truocKhiInBHXH" icon="print" />
    </ListHeader>

    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="traCuuTheoTen(searchText)"
        placeholder="Họ và tên"
        hint="Nhập họ và tên rồi nhấn Enter để tìm kiếm"
        dense
      >
        <template v-slot:append>
          <q-icon
            v-if="searchText !== ''"
            name="close"
            @click="searchText = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-list v-for="bhyt in bhyts" :key="bhyt.id">
      <ThongTinTheBHYT :bhyt="bhyt" />
      <q-separator spaced inset />
    </q-list>

    <q-dialog v-model="showDialogBHYT">
      <q-card class="my-card">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">Nộp BHYT</div>
          <div class="text-caption text-grey">
            <div class="row">
              <div class="col">
                <q-input dense v-model="t500" label="T500" />
              </div>
              <div class="col">
                <q-input dense v-model="t200" label="T200" />
              </div>
              <div class="col">
                <q-input dense v-model="t100" label="T100" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input dense v-model="t50" label="T50" />
              </div>
              <div class="col">
                <q-input dense v-model="t20" label="T20" />
              </div>
              <div class="col">
                <q-input dense v-model="t10" label="T10" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input dense v-model="t5" label="T5" />
              </div>
              <div class="col">
                <q-input dense v-model="t2" label="T2" />
              </div>
              <div class="col">
                <q-input dense v-model="t1" label="T1" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          Tổng:
          {{
            (
              500000 * t500 +
              200000 * t200 +
              100000 * t100 +
              50000 * t50 +
              20000 * t20 +
              10000 * t10 +
              5000 * t5 +
              2000 * t2 +
              1000 * t1
            ).toLocaleString()
          }}
          <br />
          Còn thiếu:
          {{
            (
              daNopBHYT -
              (500000 * t500 +
                200000 * t200 +
                100000 * t100 +
                50000 * t50 +
                20000 * t20 +
                10000 * t10 +
                5000 * t5 +
                2000 * t2 +
                1000 * t1)
            ).toLocaleString()
          }}
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            round
            icon="print"
            @click="print(1)"
          />
          <q-btn
            v-close-popup
            flat
            color="primary"
            round
            icon="download"
            @click="printC17(1)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogBHXH">
      <q-card class="my-card">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">Nộp BHXH</div>
          <div class="text-caption text-grey">
            <div class="row">
              <div class="col">
                <q-input dense v-model="t500" label="T500" />
              </div>
              <div class="col">
                <q-input dense v-model="t200" label="T200" />
              </div>
              <div class="col">
                <q-input dense v-model="t100" label="T100" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input dense v-model="t50" label="T50" />
              </div>
              <div class="col">
                <q-input dense v-model="t20" label="T20" />
              </div>
              <div class="col">
                <q-input dense v-model="t10" label="T10" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input dense v-model="t5" label="T5" />
              </div>
              <div class="col">
                <q-input dense v-model="t2" label="T2" />
              </div>
              <div class="col">
                <q-input dense v-model="t1" label="T1" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          Tổng:
          {{
            (
              500000 * t500 +
              200000 * t200 +
              100000 * t100 +
              50000 * t50 +
              20000 * t20 +
              10000 * t10 +
              5000 * t5 +
              2000 * t2 +
              1000 * t1
            ).toLocaleString()
          }}
          <br />
          Còn thiếu:
          {{
            (
              daNopBHXH -
              (500000 * t500 +
                200000 * t200 +
                100000 * t100 +
                50000 * t50 +
                20000 * t20 +
                10000 * t10 +
                5000 * t5 +
                2000 * t2 +
                1000 * t1)
            ).toLocaleString()
          }}
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="primary"
            round
            icon="print"
            @click="print(0)"
          />
          <q-btn
            v-close-popup
            flat
            color="primary"
            round
            icon="download"
            @click="printC17(0)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import { Notify } from "quasar";
export default {
  components: { ThongTinTheBHYT, ListHeader },
  data() {
    return {
      searchText: "",
      tham: 0,
      dsTheBHYT: [],
      dsSoBHXH: [],
      tongTien: 0,
      thangTruoc: 0,
      daNopBHYT: 0,
      daNopBHXH: 0,
      ngay: 0,
      showDialogBHYT: false,
      showDialogBHXH: false,
      t500: "",
      t200: "",
      t100: "",
      t50: "",
      t20: "",
      t10: "",
      t5: "",
      t2: "",
      t1: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["isLogin", "userDetails"]),
    ...mapGetters("bhyts", ["bhyts", "soDienThoais"]),
  },
  methods: {
    ...mapActions("bhyts", ["hoSoDaXuLy", "daXyLy", "XuatD03OrD05Excel"]),
    async truocKhiInBHYT() {
      this.showDialogBHYT = true;
      this.daXyLy(
        this.bhyts.filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 1 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
      );
      // await this.printC17();
    },
    async truocKhiInBHXH() {
      this.showDialogBHXH = true;
      this.daXyLy(
        this.bhyts.filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 0 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
      );
      // await this.printC17();
    },
    dongBo() {
      this.daXyLy(this.bhyts);
    },
    traCuuTheoTen(searchText) {
      this.thangTruoc = parseInt(searchText);
      this.xemThangTruoc();
    },
    copyTextToClipboard() {
      navigator.clipboard
        .writeText([...new Set(this.soDienThoais)].join())
        .then(
          function () {
            Notify.create({
              type: "positive",
              message: `Bạn đã sao chép thành công!`,
            });
          },
          function (err) {
            Notify.create({
              type: "negative",
              message: "Không thực hiện được!" + err,
            });
          }
        );
    },
    xemThangTruoc() {
      this.thangTruoc = this.thangTruoc + 1;
      this.loadData();
    },
    sleep(t) {
      return new Promise((resolve) => setTimeout(resolve, t));
    },
    async loadData() {
      const ngayHomNay = new Date().getDate();
      await this.sleep(1000);
      await this.hoSoDaXuLy({
        thangTruoc: this.thangTruoc,
        mangLuoiId: this.userDetails.mangLuoiId,
      });
      this.tham = await this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            [4, 8, 9].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 1
        )
        .map((t) => t.tongTien)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        );
      this.daNopBHYT = await this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            [4].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 1 &&
            ngayHomNay - this.ngay === new Date(t.ngayNopHoSo).getDate()
        )
        .map((t) => t.tongTien)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        );
      this.daNopBHXH = await this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            [4].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 0 &&
            ngayHomNay - this.ngay === new Date(t.ngayNopHoSo).getDate()
        )
        .map((t) => t.tongTien)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        );
      this.tongTien = await this.bhyts
        .filter(
          (t) =>
            t.userId !== this.userDetails.id &&
            [4, 8, 9].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 1
        )
        .map((t) => t.tongTien)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        );

      this.dsTheBHYT = this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 1 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
        .map((t) => t.maSoBhxh)
        .join();
      this.dsSoBHXH = this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 0 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
        .map((t) => t.maSoBhxh)
        .join();
      console.log(this.dsSoBHXH);
    },
    async download() {
      const taiLieus = await this.XuatD03OrD05Excel(
        this.bhyts
          .filter((t) => t.userId === this.userDetails.id)
          .map((x) => x.transactionId)
      );
      taiLieus.forEach((taiLieu) => {
        let a = document.createElement("a");
        a.href = `data:${taiLieu.fileType};base64,${taiLieu.base64}`;
        a.download = taiLieu.fileName;
        a.click();
      });
    },
    async print(maThuTuc) {
      let a = document.createElement("a");
      a.target = "_blank";
      let lienKet = `https://app.hotham.vn/nop-bhyt/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?`;
      if (this.daNopBHYT && maThuTuc === 1)
        lienKet += `tienBHYT=${this.daNopBHYT}`;
      if (this.daNopBHXH && maThuTuc === 0)
        lienKet += `&tienBHXH=${this.daNopBHXH}`;
      if (this.t500) lienKet += `&t500=${this.t500}`;
      if (this.t200) lienKet += `&t200=${this.t200}`;
      if (this.t100) lienKet += `&t100=${this.t100}`;
      if (this.t50) lienKet += `&t50=${this.t50}`;
      if (this.t20) lienKet += `&t20=${this.t20}`;
      if (this.t10) lienKet += `&t10=${this.t10}`;
      if (this.t5) lienKet += `&t5=${this.t5}`;
      if (this.t2) lienKet += `&t2=${this.t2}`;
      if (this.t1) lienKet += `&t1=${this.t1}`;
      // a.href = `&tienBHYT=4988520&t500=3&t200=1&t100=4&t50=46&t20=100`;
      a.href = lienKet;
      a.click();
      // await this.printC17();
    },
    async printC17(maThuTuc) {
      let a = document.createElement("a");
      a.target = "_blank";
      let lienKet = `https://app.hotham.vn/mau-c17/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?tongTien=${
        maThuTuc === 1 ? this.daNopBHYT : this.daNopBHXH
      }&maSoBhxhs=${maThuTuc === 1 ? this.dsTheBHYT : this.dsSoBHXH}`;
      a.href = lienKet;
      a.click();
    },
  },
  async mounted() {
    if (this.$route.query.ngay) {
      this.ngay = parseInt(this.$route.query.ngay);
    }
    if (this.$route.query.thang) {
      this.thangTruoc = parseInt(this.$route.query.thang);
    }
    this.loadData();
  },
};
</script>
