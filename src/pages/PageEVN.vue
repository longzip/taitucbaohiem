<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách Khách hàng EVN / Tổng: {{tongCong.toLocaleString()}}
      <q-btn
        rounded
        color="primary"
        @click="copySoDienThoaiToClipboard()"
        icon="content_copy"
      />
      <q-btn
        rounded
        color="primary"
        @click="showDialog=true"
        icon="print"
      />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tìm kiếm theo thông tin thẻ BHYT"
        @keyup.enter="timKiem(searchText)"
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
    <q-list v-for="evn in evns" :key="evn.id">
      <q-item>
        <q-item-section>
          <q-item-label>{{ evn.ten }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.diaChi }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.soDienThoai }}</q-item-label>
          <q-item-label caption lines="2">{{ evn.ghiChu }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{ evn.ma }}</q-item-label>
          <q-icon
            name="content_copy"
            @click="copyTextToClipboard(evn.ma)"
          /> 
          <q-item-label caption>Số tiền: {{ parseInt(evn.soTien).toLocaleString() }}</q-item-label>
          <q-item-label caption>{{ new Date(evn.updated_at).toLocaleString() }}</q-item-label>
          </q-item-section
      ></q-item>
      <q-separator spaced inset />
    </q-list>

    <q-dialog v-model="showDialog">
      <q-card class="my-card">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            Bảng kê các loại tiền
          </div>
          <div class="text-caption text-grey">
            <div class="row">
              <div class="col">
                <q-input
                dense
                v-model="t500"
                label="T500"
              />
              </div>
              <div class="col">
              <q-input
              dense
              v-model="t200"
              label="T200"
            />
              </div>
                  <div class="col">
                  <q-input
                  dense
                  v-model="t100"
                  label="T100"
                />
              </div>
            </div>
            
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  v-model="t50"
                  label="T50"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  v-model="t20"
                  label="T20"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  v-model="t10"
                  label="T10"
                />
              </div>
            </div>
            
            <div class="row">
              <div class="col">
                <q-input
                  dense
                  v-model="t5"
                  label="T5"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  v-model="t2"
                  label="T2"
                />
              </div>
              <div class="col">
                <q-input
                  dense
                  v-model="t1"
                  label="T1"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          Tổng: {{(500000*t500+200000*t200+100000*t100+50000*t50+20000*t20+10000*t10+5000*t5+2000*t2+1000*t1).toLocaleString()}}
          <br>
          Còn thiếu: {{(tongCong - (500000*t500+200000*t200+100000*t100+50000*t50+20000*t20+10000*t10+5000*t5+2000*t2+1000*t1)).toLocaleString()}}
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" round icon="print" @click="print()" />
        </q-card-actions>
      </q-card>
        </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "EVNPage",
  data() {
    return {
      searchText: "",
      evns: [],
      tongCong: 0,
      showDialog: false,
      t500: '',
      t200: '',
      t100: '',
      t50: '',
      t20: '',
      t10: '',
      t5: '',
      t2: '',
      t1: '',
    };
  },
  methods: {
    async timKiem(searchText,homNay=false) {
      let url = 'https://evn-buudienxatulap.herokuapp.com/api/evns?';
      if(searchText)
        url += `name=${searchText}`
      if(homNay)
        url += `homNay=${homNay}`
      const { data } = await axios.get(url);
      this.evns = data;
      this.tongCong = await data.map(t=>t.soTien).reduce(
        ( previousValue, currentValue ) => previousValue + parseInt(currentValue),
        0
      );
    },
    copyTextToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        function () {
          Notify.create({
            type: "positive",
            message: `Bạn đã sao chép: ${text}`,
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
    copySoDienThoaiToClipboard() {
      navigator.clipboard
        .writeText([...new Set(this.evns.map(e => e.soDienThoai))].join())
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
    async print(){
      let a = document.createElement('a');
      a.target = '_blank';
      let lienKet = `https://cmsbudientulap.herokuapp.com/nop-bhyt/${new Date().toISOString().slice(0,10)}/pdf?`
      if(this.tongCong) lienKet += `tienDien=${this.tongCong}`;
      if(this.t500) lienKet += `&t500=${this.t500}`;
      if(this.t200) lienKet += `&t200=${this.t200}`;
      if(this.t100) lienKet += `&t100=${this.t100}`;
      if(this.t50) lienKet += `&t50=${this.t50}`;
      if(this.t20) lienKet += `&t20=${this.t20}`;
      if(this.t10) lienKet += `&t10=${this.t10}`;
      if(this.t5) lienKet += `&t5=${this.t5}`;
      if(this.t2) lienKet += `&t2=${this.t2}`;
      if(this.t1) lienKet += `&t1=${this.t1}`;
      a.href = lienKet;
      a.click();
    }
  },
  mounted() {
    if (this.$route.query.q) {
      this.tongCong = parseInt(this.$route.query.q);
    }
    else
      this.timKiem('',true);
  },
});
</script>
