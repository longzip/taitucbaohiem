import { apiStore, client } from "src/boot/axios";
import { Loading, QSpinnerIos, Notify } from "quasar";
import GET_CART_QUERY from "src/queries/get-cart";
import ADD_TO_CART from "src/mutations/add-to-cart";
import LOGIN_USER from "src/mutations/login-user";
import CHECKOUT_MUTATION from "src/mutations/checkout";
import PRODUCTS_QUERY from "src/queries/products";
import CLEAR_CART_MUTATION from "src/mutations/clear-cart";
import EMPTY_CART_MUTATION from "src/mutations/empty-cart";
import APPLY_COUPON from "src/mutations/apply-coupon";
export async function loginUser({ commit }, { username, password }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const { data } = await client.mutate({
    mutation: LOGIN_USER,
    variables: {
      input: {
        username,
        password,
      },
    },
  });
  Loading.hide();
  commit("setAuthToken", data.login);
}

export async function getCart({ commit }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.query({
      query: GET_CART_QUERY,
    });
    commit("setCart", data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
  }
  Loading.hide();
}

export async function applyCoupon({ commit }, { code = "TODO5" }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.mutate({
      mutation: APPLY_COUPON,
      variables: {
        input: {
          code,
        },
      },
    });

    Loading.hide();
    commit("setCart", data.applyCoupon);
    Notify.create({
      type: "positive",
      message: `Áp dụng mã giảm giá!`,
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `${error}`,
    });
  }
}

export async function addToCart({ commit }, { productId, quantity = 1 }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.mutate({
      mutation: ADD_TO_CART,
      variables: {
        input: {
          productId: parseInt(productId),
          quantity,
        },
      },
    });
    Loading.hide();
    commit("setCart", data.addToCart);
    Notify.create({
      type: "positive",
      message: `Đã thêm vào giỏ hàng!`,
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Không thể thêm sản phẩm hết hàng!`,
    });
  }
}
export async function removeItemsFromCart({ commit }, { keys }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.mutate({
      mutation: CLEAR_CART_MUTATION,
      variables: {
        input: {
          keys,
        },
      },
    });
    Loading.hide();
    commit("setCart", data.removeItemsFromCart);
    Notify.create({
      type: "positive",
      message: `Đã xóa sản phẩm giỏ hàng!`,
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Không thể xóa sản phẩm giỏ hàng!`,
    });
  }
}
export async function emptyCart({ commit }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.mutate({
      mutation: EMPTY_CART_MUTATION,
      variables: {
        input: {},
      },
    });
    Loading.hide();
    commit("setCart", data.emptyCart);
    Notify.create({
      type: "positive",
      message: `Đã xóa sản phẩm giỏ hàng!`,
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Không thể xóa sản phẩm giỏ hàng!`,
    });
  }
}

export async function checkout({ commit, state, dispatch }, { email }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.mutate({
      mutation: CHECKOUT_MUTATION,
      variables: {
        input: {
          paymentMethod: "cod",
          billing: {
            //   address1: "tự lập, mê linh",
            email,
            //   phone: "0374638603",
            //   lastName: "Long",
            //   firstName: "Lỗ ",
            //   country: "VN",
            //   city: "Hà Nội",
            //   state: "HN"
          },
        },
      },
    });
    dispatch("getCart");
    const {
      checkout: { order, redirect },
    } = data;
    const a = document.createElement("a");

    a.target = "_blank";
    a.href = `https://store.hotham.vn/wordpress/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&document_type=invoice&order_ids=${
      order.orderNumber
    }&order_key=${new URL(redirect).searchParams.get("key")}`;
    a.click();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Không thể tạo đơn hàng hàng!`,
    });
  }
  Loading.hide();
}

export async function getProducts({ commit }) {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await client.query({
      query: PRODUCTS_QUERY,
      variables: {
        first: 500,
        where: {
          stockStatus: "IN_STOCK",
          supportedTypesOnly: true,
          categoryNotIn: ["dGVybTo2MQ==", "dGVybTo2NQ==", ""],
        },
      },
    });
    commit("setProducts", data);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Lỗi khi tải dữ liệu sản phẩm!`,
    });
  }
  Loading.hide();
}
