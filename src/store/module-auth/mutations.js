export const setUserDetails = (state, payload) => {
  state.userDetails = payload;
};
export const addUser = (state, payload) => {
  Vue.set(state.users, payload.userId, payload.userDetails);
};
export const updateUser = (state, payload) => {
  Object.assign(state.users[payload.userId], payload.userDetails);
};
export const addMessage = (state, payload) => {
  Vue.set(state.messages, payload.messageId, payload.messageDetails);
};
export const clearMessages = (state) => {
  state.messages = {};
};
export const setIsLogin = (state, payload) => {
  state.isLogin = payload;
  localStorage.setItem("setIsLogin", payload);
};
