<template>
  <div class="q-pa-md">
    <ListHeader bgcolor="bg-orange-4">
      Giỏ hàng {{ cart?.total }}
      <q-icon name="remove_shopping_cart" @click="emptyCart()" />
      Mã giảm giá: {{ cart?.appliedCoupons?.map((c) => c.code).join() }}
    </ListHeader>
    <q-list v-if="cart?.contents?.nodes">
      <div v-for="cartItem in cart.contents.nodes" :key="cartItem.key">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="cartItem.product.node.featuredImage.node.sourceUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ cartItem.product.node.name }}</q-item-label>
            <q-icon
              name="remove_shopping_cart"
              @click="removeItemsFromCart({ keys: cartItem.key })"
            />
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{ cartItem.quantity }}</q-item-label>
            <q-item-label caption>{{ cartItem.total }}</q-item-label>
            <q-icon
              name="add_shopping_cart"
              @click="
                addToCart({ productId: cartItem.product.node.databaseId })
              "
            />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <!-- <q-btn @click="checkout()" color="white" text-color="black" label="Thanh toán" /> -->
    <q-checkbox
      @click="updateMaGiamGia"
      left-label
      v-model="maGiamGia"
      label="Giảm giá 5%"
    />
    <q-input
      outlined
      bottom-slots
      v-model="email"
      label="Địa chỉ email"
      type="email"
      suffix="@gmail.com"
      :dense="dense"
    >
      <template v-slot:before>
        <q-icon name="contact_mail" />
      </template>

      <template v-slot:hint> Nhập địa chỉ email xác nhận đơn hàng. </template>

      <template v-slot:append>
        <q-btn
          @click="confirmThanhToan({ email: `${email}@gmail.com` })"
          round
          dense
          flat
          icon="shopping_cart_checkout"
        />
      </template>
    </q-input>
    <ListHeader bgcolor="bg-orange-4">
      Sản phẩm {{ parseInt(tongTien).toLocaleString() }}đ
    </ListHeader>
    <div class="q-gutter-y-md column">
      <q-input
        outlined
        v-model="searchText"
        @keyup.enter="traCuuTheoTen(searchText)"
        placeholder="Tìm sản phẩm"
        hint="Nhập thông tin sản phẩm rồi nhấn Enter để tìm kiếm"
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
      <div v-for="product in productsByName(searchText)" :key="product.id">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="product.featuredImage.node.sourceUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ product.name }}</q-item-label>
            <q-item-label caption>Mã:{{ product.sku }}</q-item-label>
            <q-item-label caption
              >Kho còn:{{ product.stockQuantity }}</q-item-label
            >
          </q-item-section>
          <q-item-section side top>
            <q-item-label caption>{{ product.price }}</q-item-label>
            <q-item-label caption>{{ product.regularPrice }}</q-item-label>
            <q-icon
              name="add_shopping_cart"
              @click="confirmAddToCart(product.productId)"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
export default {
  components: { ListHeader },
  data() {
    return {
      email: "lovanlong",
      searchText: "",
      maGiamGia: false,
    };
  },
  methods: {
    ...mapActions("products", [
      "getCart",
      "addToCart",
      "checkout",
      "loginUser",
      "getProducts",
      "applyCoupon",
      "removeItemsFromCart",
      "emptyCart",
    ]),
    updateMaGiamGia() {
      this.$q
        .dialog({
          title: "Mã Giảm Giá",
          message: "Nhập mã giảm giá",
          prompt: {
            model: "TODO5",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.applyCoupon({
            code: data,
          });
        });
    },
    confirmAddToCart(productId) {
      this.$q
        .dialog({
          title: "Thêm vào giỏ hàng",
          message: "Số lượng",
          prompt: {
            model: 1,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.addToCart({
            productId,
            quantity: parseInt(data),
          });
        });
    },
    confirmThanhToan(data) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Thanh toán đơn hàng?",
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          this.checkout(data);
        });
    },
  },
  computed: {
    ...mapGetters("products", [
      "authToken",
      "user",
      "cart",
      "products",
      "productsByName",
      "tongTien",
    ]),
  },
  mounted() {
    this.getCart();
    this.getProducts();
  },
};
</script>
