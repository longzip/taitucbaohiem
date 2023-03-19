
export function setAuthToken (state, {authToken, user}) {
    state.authToken = authToken;
    state.user = user;
}
export function setCart (state, {cart}) {
    state.cart = cart;
}
export function addToCart (state, {cart}) {
    state.cart = cart;
}

