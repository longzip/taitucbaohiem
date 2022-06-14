<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Danh sách KHL
      <q-btn
        rounded
        color="primary"
        @click="copySoDienThoaiToClipboard()"
        icon="content_copy"
      />
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        placeholder="Từ khóa"
        hint="Tìm kiếm theo thông tin thẻ BHYT"
        @keyup.enter="timKiem"
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
    <q-list v-for="product in products.nodes" :key="product.id">
      <q-item>
        <q-item-section top thumbnail class="q-ml-none">
          <img :src="product.image.sourceUrl">
        </q-item-section>

        <q-item-section>
          <q-item-label>{{product.name}}</q-item-label>
          <q-item-label v-html="product.shortDescription" caption></q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{product.price}}</q-item-label>
          <q-item-label caption>{{product.sku}}</q-item-label>
        </q-item-section>
      </q-item>
      
      <q-separator spaced inset />
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";

export default defineComponent({
  components: { ListHeader },
  name: "KhlPage",
  data() {
    return {
      searchText: "",
      products: []
    };
  },
  methods: {
    async timKiem() {
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
    async loadData(){
        const API_URL = 'https://buudienxatulap.ngoclong.ga/wordpress/graphql';
        const  query = `
            query MyQuery {
            products(first: 100) {
                nodes {
                id
                productId: databaseId
                averageRating
                slug
                sku
                shortDescription
                image {
                    id
                    altText
                    sourceUrl
                }
                name
                ... on SimpleProduct {
                    price
                    regularPrice
                    id
                }
                ... on VariableProduct {
                    price
                    id
                    regularPrice
                }
                ... on ExternalProduct {
                    price
                    id
                    externalUrl
                    regularPrice
                    buttonText
                }
                ... on GroupProduct {
                    id
                    products {
                    nodes {
                        ... on SimpleProduct {
                        id
                        price
                        regularPrice
                        }
                    }
                    }
                }
                }
            }
            }

        `

        const {data} = await axios.post(API_URL, {query, variables: {}})
        
        this.products = data.data.products;
    }
  },
  mounted(){
    this.loadData();
  }
});
</script>
