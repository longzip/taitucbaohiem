import { api } from "../boot/axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
export default {
  import: async (url, payload) => {
    let result = {};
    if (navigator.onLine) {
      try {
        result = await api.post(url, payload);
        if (result)
          Notify.create({
            type: "positive",
            message: "Bạn đã lưu thành công!",
          });
        else
          Notify.create({
            type: "negative",
            message: "Lưu dữ liệu thất bại!",
          });
      } catch (error) {
        if (error.toString().includes("Network", 0)) {
          Notify.create({
            message: "Không thể kế nối đến máy chủ !",
            color: "red",
          });
        }
      }
    } else {
      Notify.create({
        message: "Không có kết nối Internet !",
        color: "red",
      });
    }
    return result;
  },
  post: async (url, payload) => {
    let result = {};
    if (navigator.onLine) {
      let storeCostcenter = {
        ...payload,
      };
      delete storeCostcenter.createdAt;
      delete storeCostcenter.updatedAt;
      Object.keys(storeCostcenter).forEach(
        (key) =>
          (storeCostcenter[key] === null ||
            storeCostcenter[key] === undefined) &&
          delete storeCostcenter[key]
      );
      try {
        result = await api.post(url, storeCostcenter);
        if (result)
          Notify.create({
            type: "positive",
            message: "Bạn đã lưu thành công!",
          });
        else
          Notify.create({
            type: "negative",
            message: "Lưu dữ liệu thất bại!",
          });
      } catch (error) {
        if (error.toString().includes("Network", 0)) {
          Notify.create({
            message: "Không thể kế nối đến máy chủ !",
            color: "red",
          });
        }
      }
    } else {
      Notify.create({
        message: "Không có kết nối Internet !",
        color: "red",
      });
    }
    return result;
  },
  delete: async (url) => {
    let result = {};
    if (navigator.onLine) {
      try {
        result = await api.delete(url);
        if (result)
          Notify.create({
            type: "positive",
            message: "Bạn đã lưu thành công!",
          });
        else
          Notify.create({
            type: "negative",
            message: "Lưu dữ liệu thất bại!",
          });
      } catch (error) {
        if (error.toString().includes("Network", 0)) {
          Notify.create({
            message: "Không thể kế nối đến máy chủ !",
            color: "red",
          });
        }
      }
    } else {
      Notify.create({
        message: "Không có kết nối Internet !",
        color: "red",
      });
    }
    return result;
  },
  put: async (url, payload) => {
    let result = {};
    if (navigator.onLine) {
      let updateItem = {
        ...payload,
      };
      delete updateItem.createdAt;
      delete updateItem.updatedAt;
      Object.keys(updateItem).forEach(
        (key) =>
          (updateItem[key] === null || updateItem[key] === undefined) &&
          delete updateItem[key]
      );
      try {
        result = await api.put(url, updateItem);
        console.log(result);
        if (result)
          Notify.create({
            type: "positive",
            message: "Bạn đã lưu thành công!",
          });
        else
          Notify.create({
            type: "negative",
            message: "Lưu dữ liệu thất bại!",
          });
      } catch (error) {
        if (error.toString().includes("Network", 0)) {
          Notify.create({
            message: "Không thể kế nối đến máy chủ !",
            color: "red",
          });
        }
      }
    } else {
      Notify.create({
        message: "Không có kết nối Internet !",
        color: "red",
      });
    }
    return result;
  },
  get: async (url) => {
    let result = {};
    if (navigator.onLine) {
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      try {
        result = await api.get(url);
        // if (result)
        //   Notify.create({
        //     type: 'positive',
        //     message: 'Tải dữ liệu thành công!'
        //   })
        // else
        //   Notify.create({
        //     type: 'negative',
        //     message: 'Không có dữ liệu!'
        //   })
      } catch (error) {
        if (error.toString().includes("Network", 0)) {
          Notify.create({
            message: "Không thể kế nối đến máy chủ !",
            color: "red",
          });
        }
      }
    } else {
      Notify.create({
        message: "Không có kết nối Internet !",
        color: "red",
      });
    }
    Loading.hide();
    return result;
  },
};
