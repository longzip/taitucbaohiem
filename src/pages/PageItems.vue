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
    <q-list bordered>
      <div v-for="donHang in itemBy(searchText)" :key="donHang.id">
        <q-item>
          <q-item-section>
            <q-item-label>{{ donHang.senderName }} </q-item-label>

            <q-item-label caption lines="2">
              <a
                target="_blank"
                :href="`https://zalo.me/${donHang.senderPhone}`"
                >{{ donHang.senderPhone }}</a
              >
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
            <q-item-label caption
              >Số tiền:
              {{
                parseInt(donHang.totalFeeSpecial).toLocaleString()
              }}</q-item-label
            >
            <q-item-label caption
              >COD:
              {{
                donHang.codAmount
                  ? parseInt(donHang.codAmount).toLocaleString()
                  : ""
              }}</q-item-label
            >
            <q-item-label caption>{{
              new Date(donHang.updatedDate).toLocaleString()
            }}</q-item-label>
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
  },
  methods: {
    ...mapActions("items", ["getItems"]),
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
    const [nam, thang, ngay] = new Date().toISOString().slice(0, 10).split("-");
    const denNgay = [ngay, thang, nam].join("/");
    // const tuNgay = date.subtractFromDate(new Date(nam, thang, ngay), { days: 1 }).toISOString().slice(0, 10).split("-").reverse().join("/");
    const tuNgay =
      parseInt(ngay) === 1
        ? new Date(nam, thang - 1, 0)
            .toISOString()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/")
        : [parseInt(ngay - 1), thang, nam].join("/");
    this.getItems({ tuNgay, denNgay });
  },
});
</script>
