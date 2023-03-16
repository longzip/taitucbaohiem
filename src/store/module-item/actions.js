import { Loading, QSpinnerIos } from "quasar";
import { apiKHL } from "src/boot/axios";

export const loginUser = async ({commit}, {username,password}) =>{
    var data = JSON.stringify({
        username,
        password,
        ip: "",
        random: 0.8677049060452371,
      });

      var config = {
        headers: {
          capikey: "19001235",
          "Content-Type": "application/json",
        }
      };

      const {
        data: { tokenFe },
      } = await apiKHL.post(
        "/api/auth/signinKhl",
        data,
        config
      );
      commit("setTokenFe", tokenFe);
}
export const getItems = async ({ commit, dispatch, state },{tuNgay,denNgay}) =>{
    if (!state.tokenFe) await dispatch('loginUser',{
        username: "142010_THAMHT",
        password: "Abc@123456789"
    });
      const data = JSON.stringify({
        orgCode: "142010",
        tuNgay: tuNgay ? tuNgay : [1, parseInt(state.thang), state.nam].join("/"),
        denNgay: denNgay ? denNgay : new Date(state.nam, parseInt(state.thang), 1)
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/"),
        pageNum: 0,
        pageSize: 5000,
        sourceSystem: "KHL",
      });
      const config = {
        headers: {
          Authorization: `Bearer ${state.tokenFe}`,
          "Content-Type": "application/json",
        },
      };
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      const {
        data: [soLuong, items],
      } = await apiKHL.post("/khl/getItemDtl",data,config);
      Loading.hide();
      commit("setItems", items);
}