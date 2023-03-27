
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

export function tongTien (state) {
    if(state.products.length === 0) return 0;
    return state.products.filter(p=>p.stockQuantity && p.price)
        .map((t) => parseInt(t.stockQuantity) * parseInt(t.price.replace(/[^\d]*/g, '')))
        .reduce(
            (previousValue, currentValue) =>
                previousValue + parseInt(currentValue),
            0
    );
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

