<template>
    <div class="q-pa-md">
        <ListHeader bgcolor="bg-orange-4">
            Báo cáo chi tiết giao dịch: {{ parseInt(tongTien).toLocaleString() }} / {{ parseInt(tongSoThe).toLocaleString() }}
        </ListHeader>
        <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
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
    <q-list>
        <div v-for="bhyt in timBhyts(this.searchText)" :key="bhyt.id">
            <ThongTinTheBHYT :bhyt="bhyt" />
             <q-separator spaced inset />
        </div>
    </q-list>
    </div>
    
</template>
<script>
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
import ThongTinTheBHYT from "src/components/ThongTinTheBHYT.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    components: { ThongTinTheBHYT, ListHeader },
    data(){
        return {
            searchText: "",
            tuThang: "2023-01-01 00:00:00",
            denThang: "2024-01-01 00:00:00"
        }
    },
    methods: {
        ...mapActions("bhyts", ["getBaoCaoChiTietGiaoDich"]),
    },
    computed: {
        ...mapGetters("bhyts", ["timBhyts", "tongSoThe","tongTien"]),
    },
    mounted(){
        if(this.$route.query.tuThang)
        this.tuThang = this.$route.query.tuThang;
        if(this.$route.query.denThang)
        this.denThang = this.$route.query.denThang;
        this.getBaoCaoChiTietGiaoDich({tuThang: this.tuThang, denThang: this.denThang});
    }
}
</script>