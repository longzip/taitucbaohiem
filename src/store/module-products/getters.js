
export function authToken (state) {
    return state.authToken;
}

export function user (state) {
    return state.user;
}

export function cart (state) {
    return state.cart;
}

export function products (state) {
    return state.products;
}
export const productsByName = (state) => (searchText) => {
    if (!searchText) return state.products;
    return [
        ...state.products.filter((product) =>
          (
            product.name +
            product.sku
          )
            .toLowerCase()
            .includes(searchText.toLowerCase())
        ),
      ];
}

