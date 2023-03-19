
export function setAuthToken (state, {authToken, user}) {
    state.authToken = authToken;
    state.user = user;
}
export function setCart (state, {cart}) {
    console.log(cart)
    state.cart = cart;
}

export function setProducts (state, {products}) {
    state.products = products.nodes;
}

export function addToCart (state, {cart}) {
    state.cart = cart;
}

