<template>
  <q-page>
    <q-banner
      inline-actions
      :class="'bg-orange-4'"
      class="list-header text-white text-center"
    >
      <div class="inline bg-orange-4 rounded-borders cursor-pointer">
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          Kỳ: {{ ky }} | BHYT-{{
            bhyts.filter((t) => t.maThuTuc === 1).length
          }}
          ({{ tham.toLocaleString() }}-{{ tongTien.toLocaleString() }}đ) +
          BHXHTN-{{ bhyts.filter((t) => t.maThuTuc === 0).length }} ({{
            thamTN.toLocaleString()
          }}-{{ tongTienTN.toLocaleString() }}đ) / Đã nộp BHYT:
          {{ daNopBHYT.toLocaleString() }} - Đã nộp BHXH:
          {{ daNopBHXH.toLocaleString() }}
        </div>
        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable @click="loadData()" v-close-popup>
              <q-item-section>Tải lại</q-item-section>
            </q-item>
            <q-item clickable @click="xemThangTruoc()" v-close-popup>
              <q-item-section>Xem tháng trước</q-item-section>
            </q-item>
            <q-item clickable @click="dongBo()" v-close-popup>
              <q-item-section>Đồng bộ</q-item-section>
            </q-item>
            <q-item clickable @click="download()" v-close-popup>
              <q-item-section>Tải D03 & D05</q-item-section>
            </q-item>
            <q-item clickable @click="truocKhiInBHYT()" v-close-popup>
              <q-item-section>In nộp tiền BHYT</q-item-section>
            </q-item>
            <q-item clickable @click="truocKhiInBHXH()" v-close-popup>
              <q-item-section>In nộp tiền BHXH TN</q-item-section>
            </q-item>
            <q-item clickable @click="xuatC17()" v-close-popup>
              <q-item-section>Xuất C17 ngày</q-item-section>
            </q-item>
            <q-item clickable @click="xuatC17M()" v-close-popup>
              <q-item-section>Xuất C17 tháng</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                resetBhyt(
                  searchText
                    ? bhyts.filter((bhyt) => bhyt.userName !== searchText)
                    : []
                )
              "
              v-close-popup
            >
              <q-item-section>Xóa danh sách</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="
                resetBhyt(
                  searchText
                    ? bhyts.filter((bhyt) => bhyt.userName === searchText)
                    : []
                )
              "
              v-close-popup
            >
              <q-item-section>Giữ lại danh sách</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-banner>

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

    <q-dialog v-model="showDialogAll">
      <q-card class="my-card">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">Nộp BHYT & BHXH</div>
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
              daNopBHYT +
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
            @click="print(3)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
          <!-- <q-btn
            :disable="coTheIn"
            v-close-popup
            flat
            color="primary"
            round
            icon="download"
            @click="printC17(1)"
          /> -->
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
          <!-- <q-btn
            :disable="coTheIn"
            v-close-popup
            flat
            color="primary"
            round
            icon="download"
            @click="printC17(0)"
          /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";

import { Notify } from "quasar";
export default {
  components: { ThongTinTheBHYT },
  data() {
    return {
      ky: "",
      searchText: "",
      coTheIn: 1,
      tham: 0,
      thamTN: 0,
      dsTheBHYT: [],
      dsSoBHXH: [],
      tongTien: 0,
      tongTienTN: 0,
      thangTruoc: 0,
      daNopBHYT: 0,
      daNopBHXH: 0,
      ngay: 0,
      showDialogBHYT: false,
      showDialogBHXH: false,
      showDialogAll: false,
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
    ...mapActions("bhyts", [
      "hoSoDaXuLy",
      "daXyLy",
      "XuatD03OrD05Excel",
      "resetBhyt",
    ]),
    async xuatC17() {
      if (this.dsSoBHXH || this.dsTheBHYT) {
        Notify.create({
          type: "positive",
          message: `Đang xuất C17 Excell, vui lòng đợi ...!`,
        });
        await this.loadData();
        this.showDialogAll = true;

        await this.daXyLy(
          this.bhyts.filter(
            (t) =>
              t.userId === this.userDetails.id &&
              t.trangThaiHoSo === 4 &&
              new Date().getDate() - this.ngay ===
                new Date(t.ngayNopHoSo).getDate()
          )
        );
        let a = document.createElement("a");
        a.target = "_blank";
        let link = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/c17-excell/${new Date()
          .toISOString()
          .slice(0, 10)}/pdf?excell=true`;
        if (this.dsTheBHYT) link += `&bhyts=${this.dsTheBHYT}`;
        if (this.dsSoBHXH) link += `&bhxhs=${this.dsSoBHXH}`;
        a.href = link;
        a.click();
      } else
        Notify.create({
          type: "negative",
          message: "Không có dữ liệu!",
        });
    },
    async xuatC17M() {
      Notify.create({
        type: "positive",
        message: `Đang xuất C17 Excell, vui lòng đợi ...!`,
      });
      await this.loadData();

      await this.daXyLy(
        this.bhyts.filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.maThuTuc === 0 &&
            [4, 8, 9].includes(t.trangThaiHoSo)
        )
      );
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/c17/${this.ky.slice(
        0,
        2
      )}`;
      a.click();
    },
    async truocKhiInBHYT() {
      Notify.create({
        type: "positive",
        message: `Đang xuất C17 BHYT, vui lòng đợi ...!`,
      });
      await this.loadData();
      this.coTheIn = 0;
      this.showDialogBHYT = true;

      await this.daXyLy(
        this.bhyts.filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 1 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
      );
      this.coTheIn = 1;
      this.printC17(1);
    },
    async truocKhiInBHXH() {
      Notify.create({
        type: "positive",
        message: `Đang xuất C17 BHXH tự nguyện, vui lòng đợi ...!`,
      });
      await this.loadData();
      this.coTheIn = 0;
      this.showDialogBHXH = true;

      await this.daXyLy(
        this.bhyts.filter(
          (t) =>
            t.userId === this.userDetails.id &&
            t.trangThaiHoSo === 4 &&
            t.maThuTuc === 0 &&
            new Date().getDate() - this.ngay ===
              new Date(t.ngayNopHoSo).getDate()
        )
      );
      this.coTheIn = 1;
      this.printC17(0);
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
    sleep(t = 3000) {
      return new Promise((resolve) => setTimeout(resolve, t));
    },
    async loadData() {
      const ngayHomNay = new Date().getDate();

      try {
        await this.hoSoDaXuLy({
          thangTruoc: this.thangTruoc,
          mangLuoiId: this.userDetails.quaTrinhCongTac.mangLuoiId,
        });
        if (this.bhyts.length) this.ky = this.bhyts[0].ky;
      } catch (error) {
        Notify.create({
          message: "Không thể kế nối đến máy chủ !",
          color: "red",
        });
      }

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
      this.thamTN = await this.bhyts
        .filter(
          (t) =>
            t.userId === this.userDetails.id &&
            [4, 8, 9].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 0
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
      this.tongTienTN = await this.bhyts
        .filter(
          (t) =>
            t.userId !== this.userDetails.id &&
            [4, 8, 9].includes(t.trangThaiHoSo) &&
            t.maThuTuc === 0
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
      let lienKet = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/nop-bhyt/${new Date()
        .toISOString()
        .slice(0, 10)}/pdf?`;
      if (this.daNopBHYT && (maThuTuc === 1 || maThuTuc === 3))
        lienKet += `tienBHYT=${this.daNopBHYT}`;
      if (this.daNopBHXH && (maThuTuc === 0 || maThuTuc === 3))
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
      let lienKet = `https://longwebstudio.amycos.vn/wordpress/wp-content/app/mau-c17/${new Date()
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
    await this.sleep(2000);
    this.loadData();
  },
};
</script>
