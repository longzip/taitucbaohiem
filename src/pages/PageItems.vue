<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách bưu gửi</ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tháng tra cứu"
        @keyup.enter="traCuu()"
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
    <div class="q-gutter-y-md">
      <q-btn
        label="Load từ đầu tháng"
        icon="refresh"
        color="primary"
        @click="loadFromStartOfYear"
      />
      <q-btn
        label="Sao chép tất cả số điện thoại"
        icon="content_copy"
        color="primary"
        @click="copyAllPhoneToClipboard"
      />
      <q-btn
        label="Load tháng trước"
        icon="refresh"
        color="primary"
        @click="loadPreviousMonth"
      />
    </div>

    <q-card class="q-pa-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col-6">
            <div class="text-h6">Tổng số lượng bưu gửi:</div>
            <div class="text-subtitle1">{{ itemBy(searchText).length }}</div>
          </div>
          <div class="col-6">
            <div class="text-h6">Tổng cước gửi hàng:</div>
            <div class="text-subtitle1">
              {{
                itemBy(searchText)
                  .reduce((sum, item) => sum + Number(item.totalFeeSpecial), 0)
                  .toLocaleString("vi-VN")
              }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-list bordered>
      <div v-for="donHang in itemBy(searchText)" :key="donHang.id">
        <q-item>
          <q-item-section>
            <q-item-label>{{ donHang.senderName }} </q-item-label>

            <q-item-label caption lines="2">
              <a target="_blank" :href="`tel:${donHang.senderPhone}`">{{
                donHang.senderPhone
              }}</a>
              <q-icon
                name="content_copy"
                @click="copyPhoneToClipboard(donHang.senderPhone)"
              />
            </q-item-label>
            <q-item-label caption lines="2">{{
              donHang.contentNote
            }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ donHang.ttNumber }}</q-item-label>
            <q-icon name="content_copy" @click="copyTextToClipboard(donHang)" />
            <q-item-label caption>
              Số tiền: {{ donHang.totalFeeSpecial.toLocaleString("vi-VN") }}
            </q-item-label>

            <q-item-label caption>
              COD: {{ formatCurrency(donHang.codAmount) }}
            </q-item-label>

            <q-item-label caption>
              {{
                new Intl.DateTimeFormat("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(new Date(donHang.updatedDate))
              }}
            </q-item-label>
          </q-item-section></q-item
        >
        <q-separator spaced inset />
      </div>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { Notify, date } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import moment from "moment";

export default defineComponent({
  components: { ListHeader },
  name: "PageItem",
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    ...mapGetters("items", ["itemBy"]),
    ...mapState("auth", ["userDetails"]),
    formatCurrency() {
      return (amount) => {
        if (amount) {
          return parseInt(amount).toLocaleString();
        }
        return "";
      };
    },
  },
  methods: {
    ...mapActions("items", ["getItems"]),
    loadPreviousMonth() {
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const firstDayOfPreviousMonth = new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth(),
        1
      );
      const lastDayOfPreviousMonth = new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() + 1,
        0
      );

      const tuNgay = firstDayOfPreviousMonth.toLocaleDateString("vi-VN");
      const denNgay = lastDayOfPreviousMonth.toLocaleDateString("vi-VN");
      this.getItems({ tuNgay, denNgay });
    },
    loadFromStartOfYear() {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const tuNgay = startOfMonth.toLocaleDateString("vi-VN");
      const denNgay = new Date().toLocaleDateString("vi-VN");
      this.getItems({ tuNgay, denNgay });
    },

    copyPhoneToClipboard(phone) {
      navigator.clipboard.writeText(phone).then(
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
    copyAllPhoneToClipboard() {
      const phones = this.itemBy(this.searchText)
        .map((item) => item.senderPhone)
        .join("\n");
      navigator.clipboard.writeText(phones).then(
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

    copyTextToClipboard({ ttNumber, senderName, recPhone, recAdd }) {
      const { guiHangSMSText } = this.userDetails;
      navigator.clipboard
        .writeText(
          guiHangSMSText
            .replace("[Tên khách hàng]", senderName)
            .replace("[Mã vận đơn]", `${ttNumber}`)
        )
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
  },
  mounted() {
    // Get today's date using Moment.js
    const today = moment();

    // Format 'denNgay' (to date)
    const denNgay = today.format("DD/MM/YYYY");

    // Calculate 'tuNgay' (from date - 7 days)
    const tuNgay = moment().subtract(7, "days").format("DD/MM/YYYY");

    // Call getItems
    this.getItems({ tuNgay, denNgay });
  },
});
</script>
