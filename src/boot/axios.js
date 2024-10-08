import { boot } from "quasar/wrappers";
import axios from "axios";

import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// export const api = axios.create({ baseURL: "https://192.168.1.7:2024" });
export const apiKHL = axios.create({
  baseURL: "https://api-portalkhl.vnpost.vn",
});
export const apiStore = axios.create({
  baseURL: "https://store.hotham.vn/wordpress",
});

export const api = axios.create({
  baseURL: "https://app.hotham.vn",
  headers: {
    Authorization: `Bearer 2|N04KZuJ0sVeHX3puFzxXW9yEOWWvffrQh7El9e95`,
  },
});
//
export const apiServices = axios.create({
  baseURL: "https://ssm-api.vnpost.vn",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("setIsLogin")}`,
  },
});
//

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});
