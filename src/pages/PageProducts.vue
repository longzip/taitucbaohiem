<template>
    <div class="q-pa-md">
        <ListHeader bgcolor="bg-orange-4">
            Sản phẩm
        </ListHeader>
        <q-list v-if="cart?.contents?.nodes">
            <div v-for="cartItem in cart.contents.nodes" :key="cartItem.key">
                <q-item>
                    <q-item-section avatar>
                        <q-avatar rounded>
                            <img :src="cartItem.product.node.featuredImage.node.sourceUrl">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>{{cartItem.product.node.name}}</q-item-label>
                        <!-- <q-item-label v-html="product.shortDescription" caption></q-item-label> -->
                    </q-item-section>
                    <q-item-section side top>
                        <q-item-label caption>{{cartItem.quantity}}</q-item-label>
                        <q-item-label caption>{{cartItem.total}}</q-item-label>
                        <q-icon
                            name="add_shopping_cart"
                            @click="addToCart({productId: cartItem.product.node.databaseId})"
                        />
                    </q-item-section>
                </q-item>
            </div>
        </q-list>
        <q-btn @click="checkout()" color="white" text-color="black" label="Thanh toán" />
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ListHeader from "src/components/Tasks/Modals/Shared/ListHeader.vue";
export default {
    components: { ListHeader },
  methods: {
    ...mapActions("products", ["getCart","addToCart","checkout","loginUser"]),
  },
  computed: {
    ...mapGetters("products", ["authToken", "user", "cart"])
  },
  mounted(){
    this.loginUser({
        username: "buudienvhxtulap",
        password: "%1TDM95hFS!CM8Gw0(8Xju1B"
    });
    this.getCart();
  }
}
</script>