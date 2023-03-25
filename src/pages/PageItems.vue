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
        <q-list bordered >
            <div v-for="donHang in itemBy(searchText)" :key="donHang.id">
            <q-item>
              <q-item-section>
                <q-item-label
                  >{{ donHang.senderName }}
                </q-item-label>
                
                <q-item-label caption lines="2">
                  <a target="_blank" :href="`https://zalo.me/${donHang.senderPhone}`">{{
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
                <q-icon
                  name="content_copy"
                  @click="copyTextToClipboard(donHang)"
                />
                <q-item-label caption
                  >Số tiền:
                  {{
                    parseInt(donHang.totalFeeSpecial).toLocaleString()
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
import { mapGetters, mapActions } from "vuex";
import { Notify } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "PageItem",
  data() {
    return {
        searchText: "",
    }
  },
  computed: {
    ...mapGetters("items", ["itemBy"]),
  },
  methods: {
    ...mapActions("items", ["getItems"]),
    copyPhoneToClipboard(phone) {
      navigator.clipboard
        .writeText(
          phone
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
    copyTextToClipboard({ttNumber,recName,recPhone, recAdd}) {
      navigator.clipboard
        .writeText(
          `https://www.hotham.vn/tra-cuu-hang-buu-dien?q=${ttNumber}. (${[recName,recPhone, recAdd].join('\t')})`
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
    const homNay = [ngay,thang,nam].join("/");
    this.getItems({tuNgay:homNay, denNgay: homNay});
  },
});
</script>