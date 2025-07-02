<template>
  <div v-if="userDetails.isPro" class="q-pa-md">
    <q-table
      title="Đóng BHYT Hộ gia đình (Lương cơ sở: 2.340.000 VNĐ)"
      :rows="householdMembers"
      :columns="columns"
      row-key="id"
      hide-bottom
      class="my-sticky-header-table"
    >
      <!-- Slot tùy chỉnh cho cột "Số tiền đã nộp" -->
      <template v-slot:body-cell-soTienNop="props">
        <q-td :props="props">
          <q-badge color="blue-grey" :label="formatCurrency(props.value)" />

          <!-- Icon cảnh báo nếu số tiền nộp không khớp với quy định -->
          <q-icon
            v-if="props.row.soTienNop !== props.row.mucDongQuyDinh"
            name="warning"
            color="orange"
            class="q-ml-sm"
          >
            <q-tooltip class="bg-amber text-black shadow-4">
              Số tiền nộp không khớp với mức đóng theo quy định ({{
                formatCurrency(props.row.mucDongQuyDinh)
              }}
              VNĐ)
            </q-tooltip>
          </q-icon>
        </q-td>
      </template>

      <!-- Slot tùy chỉnh cho cột "Mức đóng theo quy định" -->
      <template v-slot:body-cell-mucDongQuyDinh="props">
        <q-td :props="props">
          <q-badge color="green" :label="formatCurrency(props.value)" />
        </q-td>
      </template>

      <!-- Slot tùy chỉnh cho cột "Tỷ lệ đóng" -->
      <template v-slot:body-cell-tyLe="props">
        <q-td :props="props"> {{ props.value }}% </q-td>
      </template>
      <!-- *** THÊM HÀNG TỔNG CỘNG Ở ĐÂY *** -->
      <template v-slot:bottom-row>
        <q-tr class="text-bold">
          <q-td colspan="4" class="text-right"> Tổng cộng </q-td>
          <q-td class="text-right">
            <q-badge
              color="primary"
              :label="formatCurrency(summaryData.totalSoTienNop)"
            />
          </q-td>
          <q-td class="text-right">
            <q-badge
              color="dark"
              :label="formatCurrency(summaryData.totalMucDongQuyDinh)"
            />
          </q-td>
          <q-td></q-td>
          <!-- Ô trống cho cột Ghi chú -->
        </q-tr>
      </template>
    </q-table>
    <ListHeader bgcolor="bg-orange-4"
      >Hộ gia đình {{ bhyts.length }} người. Số tiền thu: đ
      {{ parseInt(tongTienBHYTDaThu + tongTienBHXHDaThu).toLocaleString() }}/{{
        bhyts.filter((b) => b.isBHYT == 1 || b.isBHXHTN == 1).length
      }}
      <q-btn rounded color="primary" @click="print()" icon="print" />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        ref="inputSearch"
        @keyup.enter="timKiem(searchText)"
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
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions, mapState } from "vuex";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
const currentYear = new Date().getFullYear();

export default defineComponent({
  components: { ThongTinTheBHYT, ListHeader },
  name: "IndexPage",
  data() {
    return {
      maHoGd: "",
      uniqid: "",
      searchText: "",
      columns: [
        { name: "stt", label: "STT", field: "stt", align: "center" },
        {
          name: "maSoBhxh",
          label: "Mã số BHXH",
          field: "maSoBhxh",
          align: "left",
        },
        { name: "hoTen", label: "Họ và tên", field: "hoTen", align: "left" },
        // {
        //   name: "thuTu",
        //   label: "Thứ tự tham gia",
        //   field: "thuTu",
        //   align: "center",
        // },
        { name: "tyLe", label: "%", field: "tyLe", align: "center" },
        {
          name: "soTienNop",
          label: "Số tiền)",
          field: "soTienNop",
          align: "right",
        },
        {
          name: "mucDongQuyDinh",
          label: "Mức đóng",
          field: "mucDongQuyDinh",
          align: "right",
        },
        {
          name: "ghiChu",
          label: "Ghi chú",
          field: "ghiChu",
          align: "left",
          style: "white-space: normal; min-width: 250px;",
        },
      ],
    };
  },
  methods: {
    ...mapActions("bhyts", ["getAllBhyts", "dongBoDuLieu"]),
    async timKiem(searchText) {
      // const thongSoTheBHYTs = searchText.split("|");
      // if (thongSoTheBHYTs.length > 1) this.searchText = thongSoTheBHYTs[0];
      await this.dongBoDuLieu(this.searchText);
      this.$refs.inputSearch.select();
    },
    async loadData() {
      if (this.uniqid)
        await this.getAllBhyts({
          uniqid: this.uniqid,
        });
      else
        await this.getAllBhyts({
          maHoGd: this.maHoGd,
        });
    },
    async print() {
      if (this.bhyts.length > 15 || this.bhyts.length === 0) return;
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = `https://app.hotham.vn/thanh-vien-ho-gia-dinh/1/pdf?maXaUpdate=${
        this.userDetails.maXa
      }&maSoBhxhs=${this.bhyts.map((i) => i.maSoBhxh).join(",")}`;
      a.click();
    },
    formatCurrency(value) {
      if (!value && value !== 0) return "";
      return value.toLocaleString("vi-VN");
    },
  },

  computed: {
    ...mapGetters("bhyts", ["bhyts", "tongTienBHYTDaThu", "tongTienBHXHDaThu"]),
    ...mapState("auth", ["userDetails"]),
    householdMembers() {
      const BASE_SALARY = 2340000;
      const BASE_ANNUAL_CONTRIBUTION = BASE_SALARY * 0.045 * 12;
      const CONTRIBUTION_RATES = [1.0, 0.7, 0.6, 0.5, 0.4];

      // Sắp xếp các thành viên theo ngày lập và số tiền nộp để xác định đúng thứ tự
      const sortedMembers = this.bhyts
        .filter(
          (member) => new Date(member.ngayLap).getFullYear() === currentYear
        )
        .sort((a, b) => {
          const dateA = new Date(a.ngayLap);
          const dateB = new Date(b.ngayLap);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          return b.tongTien - a.tongTien;
        });

      const processedData = [];

      for (let i = 0; i < sortedMembers.length; i++) {
        const member = sortedMembers[i];
        const participationOrder = i + 1;

        // Tính toán các giá trị theo quy định
        const rateIndex = Math.min(i, CONTRIBUTION_RATES.length - 1);
        const contributionRate = CONTRIBUTION_RATES[rateIndex];
        const calculatedContribution = Math.round(
          BASE_ANNUAL_CONTRIBUTION * contributionRate
        );

        // Tạo ghi chú: liệt kê tất cả người đóng mức cao hơn
        const noteParts = [member.soTheBhyt && member.soTheBhyt.startsWith('GD') ? 'Thắm ON;' : 'Thắm TM;'];
        if (i > 0) {
          // Lặp qua tất cả những người đã xử lý trước đó
          for (let j = 0; j < i; j++) {
            const higherPayer = processedData[j]; // Lấy từ mảng đã xử lý
            noteParts.push(`${higherPayer.maSoBhxh} - ${higherPayer.tyLe}%`);
          }
        }
        const note = noteParts.join(" ");

        processedData.push({
          id: member.id,
          maSoBhxh: member.maSoBhxh,
          stt: participationOrder,
          hoTen: member.hoTen,
          thuTu: `Người thứ ${participationOrder}`,
          tyLe: contributionRate * 100,
          soTienNop: member.tongTien, // Lấy từ dữ liệu gốc
          mucDongQuyDinh: calculatedContribution, // Giá trị tính toán để so sánh
          ghiChu: note,
        });
      }

      return processedData;
    },
    summaryData() {
      return this.householdMembers.reduce(
        (acc, member) => {
          acc.totalSoTienNop += member.soTienNop;
          acc.totalMucDongQuyDinh += member.mucDongQuyDinh;
          return acc;
        },
        {
          totalSoTienNop: 0,
          totalMucDongQuyDinh: 0,
        }
      );
    },
  },

  mounted() {
    this.maHoGd = this.$route.params.id;
    if (this.maHoGd.length === 13) this.uniqid = this.maHoGd;
    this.loadData();
  },
});
</script>
