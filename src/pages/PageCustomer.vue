<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">Giỏ hàng
    </ListHeader>
    <q-list bordered padding>
      <q-item v-for="cartProduct in cartProducts" :key="cartProduct.id">
          <q-item-section>
            <q-item-label overline>{{cartProduct.name}}</q-item-label>
              <q-item-label>{{cartProduct.price}}</q-item-label>
            </q-item-section>

          <q-item-section side top>
            <q-item-label caption>x{{cartProduct.quantity}}</q-item-label>
            <q-item-label>₫{{cartProduct.thanhTien.toLocaleString()}}</q-item-label>
          </q-item-section>
      </q-item>

      <q-separator spaced />
    </q-list>
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
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="product.image.sourceUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{product.name}}</q-item-label>
          <q-item-label v-html="product.shortDescription" caption></q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{product.price}}</q-item-label>
          <q-item-label caption>{{product.sku}}</q-item-label>
          <q-icon
            name="add_shopping_cart"
            @click="addShoppingCart(product)"
          />
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
      products: [],
      cartProducts: []
    };
  },
  methods: {
    async timKiem() {
    },
    addShoppingCart({id,sku,name,price,quantity=1}){
      const newCartProduct = {id,sku,name,price,quantity,thanhTien: parseInt((price.match(/[0-9]/g)).join(''))}
      let cartProductExists = false;
      this.cartProducts.map((cartProduct) => {
        if (cartProduct.id === newCartProduct.id) {
          cartProduct.quantity++;
          cartProduct.thanhTien = parseInt((cartProduct.price.match(/[0-9]/g)).join(''))*cartProduct.quantity
          cartProductExists = true;
        }
      });
      if (!cartProductExists) this.cartProducts.push(newCartProduct);
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
        //
        this.products = JSON.parse(localStorage.getItem("products"));
        const API_URL = 'https://buudienxatulap.ngoclong.ga/wordpress/graphql';
        const  query = `
            query MyQuery {
            products(first: 1000) {
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
                }
            }
            }

        `

        const {data} = await axios.post(API_URL, {query, variables: {}})
        
        
        if(data.data){
            this.products = data.data.products;
            localStorage.setItem("products", JSON.stringify(this.products))
        }
    }
  },
  mounted(){
    this.loadData();
  }
});
</script>
