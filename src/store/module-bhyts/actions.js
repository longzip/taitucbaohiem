import client from "../../utils";
import moment from "moment";
import { Notify } from "quasar";
import { api, apiServices } from "src/boot/axios";

export const updateTrangThaiTaiTuc = async (
  { commit },
  { maSoBhxh, trangThaiTaiTuc }
) => {
  try {
    const { data } = await api.put(
      `/api/bhyts/${maSoBhxh}/trang-thai-tai-tuc`,
      { trangThaiTaiTuc }
    );
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};

const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export function setCurrentBhyt({ commit }, bhyt) {
  commit("SET_CURRENT_BHYT", bhyt);
}

export function searchBhyts({ commit, state }, searchText) {
  commit("SET_SEARCH_TEXT", searchText);
}
export function selectUser({ commit }, user) {
  commit("SET_SELECTED_USER", user);
}

export const batTatRemove = ({ commit }, payload) => {
  commit("setIsRemove", payload);
};

export const capNhatMaXa = ({ commit }, payload) => {
  commit("setMaXa", payload);
};
export const xoaThanhVienHGD = ({ commit }, payload) => {
  commit("removeBhyt", payload);
};

export const getTraCuuThongTinBHXHTN = async ({ dispatch }, payload) => {
  try {
    const { data } = await apiServices.get(
      `/api/services/app/TraCuu/TraCuuThongTinBHXHTN?maSoBhxh=${payload}`
    );
    await dispatch("saveBHXHTN", data.result.value.thongTinTns[0]);
    return data.result.value.thongTinTns[0];
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
  }
  return {};
};

export const capNhatBHXHTN = async ({ dispatch, state }, payload) => {
  let maSoBhxhs = payload.split(",");
  if (!payload) {
    maSoBhxhs = [...new Set(state.bhyts.map((t) => t.maSoBhxh)).values()];
  }
  if (maSoBhxhs.length > 0) {
    for (let index = 0; index < maSoBhxhs.length; index++) {
      await sleep();
      await dispatch("getTraCuuThongTinBHXHTN", maSoBhxhs[index]);
    }
  }
};

export const saveBHXHTN = async (
  { commit, rootGetters },
  { maSoBhxh, mucDong, maPhuongThucDong, thangBd, tienNop }
) => {
  const t = { 1: 1, 3: 3, 6: 4, 12: 7 };
  const { data: bhytUpdate } = await api.put(
    `/api/bhyts/${maSoBhxh}/tong-tien`,
    {
      isBHXHTN: 0,
      denThangDt: moment(thangBd)
        .add(t[maPhuongThucDong] ? t[maPhuongThucDong] - 1 : 0, "months")
        .endOf("month")
        .format()
        .slice(0, 10),
      mucDong,
      maPhuongThucDong,
      tienNop,
      maXa: rootGetters["auth/maXa"],
    }
  );
  await commit("updateBhyt", bhytUpdate);
};
export const getDanhSachKhachHangTaiTuc = async ({ commit }, payload) => {
  try {
    const { data } = await apiServices.post(
      "/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
      payload
    );
    return data.result.items;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
    return [];
  }
};
export const getBaoCaoChiTietGiaoDich = async (
  { commit },
  {
    tuThang = "2023-01-01 00:00:00",
    denThang = "2024-01-01 00:00:00",
    mangLuoiId = 4580,
  }
) => {
  commit("setBhyts", []);

  try {
    const { data } = await apiServices.post(
      "/api/services/app/BaoCaoTongHopGDThu/BaoCaoChiTietGiaoDich",
      {
        filterItems: [],
        maxResultCount: 5000,
        skipCount: 0,
        mangLuoiId,
        tuThang,
        denThang,
        loaiGiaoDich: 0,
      }
    );
    commit("setBhyts", data.result.items);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
  }
};

export const traCuuBhyts = async ({ commit }, payload) => {
  // commit("setBhyts", []);
  const { searchText, maXa } = payload;
  if (!searchText) return;
  const danhSachTimKiem = searchText.split(",");
  if (danhSachTimKiem.length === 1) {
    const name = searchText
      .split(" ")
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(" ");
    let url = `/api/bhyts?name=${name}&maXa=${maXa}`;
    const { data } = await api.get(url);
    commit("setBhyts", data);
    return;
  }
};

export const resetBhyt = async ({ commit }, payload) => {
  commit("setBhyts", payload);
};

export const getBhytsBySoBienLai = async ({ commit }, payload) => {
  const { data } = await api.get(`/api/bhyts?soBienLai=${payload}`);
  data.forEach((bhyt) => {
    // bhyts.set(bhyt.maSoBhxh, bhyt);
    commit("updateBhyt", bhyt);
  });
  try {
    await dispatch("dongBoDuLieu", data.map((i) => i.maSoBhxh).join());
  } catch (error) {}
};

export const getBhyts = async ({ commit }, payload) => {
  const {
    completed,
    disabled,
    name,
    thang,
    maHoGd,
    chuaDongBo,
    taiTuc,
    hetHan,
    maXa,
    nam,
    userName,
    khacUserName,
    isBHXHTN,
    isBHYT,
    tienNop,
    taiTucBHXH,
    soBienLai,
    taiTucBHYTBT,
    isCMND,
    thangBienLai,
    thangBienLaiTN,
    isPhone,
  } = payload;

  let url = "/api/bhyts?";
  if (thang) url += `thang=${thang}`;
  if (maXa) url += `&maXa=${maXa}`;
  if (taiTuc) url += `&taiTuc=${taiTuc}`;
  if (hetHan) url += `&hetHan=${hetHan}`;
  if (name) url += `&name=${name}`;
  if (nam) url += `&nam=${nam}`;
  if (userName) url += `&userName=${userName}`;
  if (khacUserName) url += `&khacUserName=${khacUserName}`;
  if (completed) url += `&completed=${completed}`;
  if (disabled) url += `&disabled=${disabled}`;
  if (maHoGd) url += `&maHoGd=${maHoGd}`;
  if (chuaDongBo) url += `&chuaDongBo=${chuaDongBo}`;
  if (isBHXHTN) url += `&isBHXHTN=${isBHXHTN}`;
  if (isBHYT) url += `&isBHYT=${isBHYT}`;
  if (isCMND) url += `&isCMND=${isCMND}`;
  if (tienNop) url += `&tienNop=${tienNop}`;
  if (taiTucBHXH) url += `&taiTucBHXH=${taiTucBHXH}`;
  if (soBienLai) url += `&soBienLai=${soBienLai}`;
  if (taiTucBHYTBT) url += `&taiTucBHYTBT=${taiTucBHYTBT}`;
  if (thangBienLai) url += `&thangBienLai=${thangBienLai}`;
  if (thangBienLaiTN) url += `&thangBienLaiTN=${thangBienLaiTN}`;
  if (isPhone) url += `&isPhone=${isPhone}`;
  const { data } = await api.get(url);
  commit("setBhyts", data);
};

export const XuatD03OrD05Excel = async ({ commit }, payload) => {
  const { data } = await client.post(
    "/api/services/app/KeKhai/XuatD03OrD05Excel",
    {
      daiLyIds: [52401],
      transactionIds: payload,
    }
  );

  return data.result;
};

export const khachChuaNop = async ({ commit }, payload) => {
  const { data } = await client.post(
    "/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
    {
      denThang: moment().startOf("months").add(1, "months").format(),
      filterItems: [],
      loaiDichVu: 1,
      mangLuoiId: 4580,
      maxResultCount: 5000,
      skipCount: 0,
      tuThang: moment().startOf("months").format(),
      type: -1,
    }
  );
  commit("getAllBhyts", [...data.result.items.reverse()]);
};

export const traCuuNoGroup = async (
  { commit, rootGetters },
  { mangLuoiId, keyMenu = "5" }
) => {
  const { data } = await client.post("/api/services/app/KeKhai/TraCuuNoGroup", {
    dateForm: "ngayLap",
    denNgay: moment().format(),
    filterItems: [],
    hoSoChuaThuTien: false,
    hoSoQuaHan: 0,
    keyMenu,
    mangLuoiId: mangLuoiId || rootGetters["auth/mangLuoiId"],
    maxResultCount: 5000,
    skipCount: 0,
    tuNgay: moment().startOf("month").format(),
  });
  commit("getAllBhyts", [...data.result.items]);
};
export const hoSoChuaXuLy = async ({ commit }, { mangLuoiId = 4580 }) => {
  const denNgay = new Date();
  denNgay.setDate(denNgay.getDate() + 2);
  const tuNgay = new Date();
  tuNgay.setDate(denNgay.getDate() - 32);
  const { data } = await client.post("/api/services/app/KeKhai/TraCuuNoGroup", {
    dateForm: "ngayLap",
    denNgay,
    filterItems: [],
    hoSoChuaThuTien: false,
    hoSoQuaHan: 0,
    keyMenu: "2",
    mangLuoiId,
    maxResultCount: 5000,
    skipCount: 0,
    tuNgay,
  });
  commit("getAllBhyts", [...data.result.items]);
};

export const hoSoDaXuLy = async ({ commit }, payload) => {
  let {
    thangTruoc = 0,
    tuNgay,
    denNgay,
    mangLuoiId = 4580,
    maThuTuc,
    keyMenu = "1",
  } = payload;

  if (!denNgay)
    denNgay = moment()
      .startOf("months")
      .add(1 - thangTruoc, "months")
      .format();
  if (!tuNgay)
    tuNgay = moment().startOf("months").subtract(thangTruoc, "months").format();

  const { data } = await client.post("/api/services/app/KeKhai/TraCuuNoGroup", {
    dateForm: "ngayLap",
    denNgay,
    filterItems: [],
    hoSoChuaThuTien: false,
    hoSoQuaHan: 0,
    keyMenu,
    maThuTuc,
    mangLuoiId,
    maxResultCount: 5000,
    skipCount: 0,
    tuNgay,
  });
  commit("getAllBhyts", [...data.result.items]);
};

export const xoaHoGd = async ({ commit }, payload) => {
  await client.get(`/api/xoaHoGd?maHoGd=${payload}`);
};

export const luuBhyt = async (bhyt) => {
  try {
    const { data } = await api.post("/api/bhyts", bhyt);
    return data;
  } catch (error) {
    return {};
  }
};

export const maTraCuu = async ({}, bienLaiId) => {
  let {
    data: { result, success },
  } = await client.get(
    `/api/services/app/KeKhai/GetDSBienLai?bienlaiId=${bienLaiId}`
  );
  if (!success) return null;
  return result[0];
};

export const xem = async ({ commit, rootGetters }, payload) => {
  const { maSoBhxh } = payload;
  let {
    data: { result },
  } = await client.get(
    `/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
      maSoBhxh.length - 10
    )}`
  );

  const { thongTinTK1, thongTinTheHGD, trangThaiThe } = result;

  if (thongTinTK1)
    try {
      const theBHYT = await luuBhyt({
        ...payload,
        ...thongTinTheHGD,
        ...thongTinTK1,
        ...trangThaiThe,
        maXa: rootGetters["auth/maXa"],
      });
      await commit("updateBhyt", { ...trangThaiThe, ...theBHYT });
      return { ...trangThaiThe, ...theBHYT };
    } catch (error) {
      await commit("updateBhyt", {
        ...payload,
        ...thongTinTheHGD,
        ...thongTinTK1,
        ...trangThaiThe,
      });
    }

  return {
    ...payload,
    ...thongTinTheHGD,
    ...thongTinTK1,
    ...trangThaiThe,
  };
};

export const traCuuTheoTen = async (
  { commit, dispatch },
  { name, maXa, maHuyen, maTinh }
) => {
  const hoTens = name.split(",");
  const hoTenDaTims = JSON.parse(localStorage.getItem("hoTens")) || [];

  for (let index = 0; index < hoTens.length; index++) {
    let { data } = await client.get(
      `/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=${maTinh}&maHuyen=${maHuyen}&maXa=${maXa}&hoTen=${hoTens[index]}&isCoDau=true&`
    );
    if (data.result.value.length) {
      data.result.value.forEach((bhyt) => {
        // bhyts.set(bhyt.maSoBhxh, bhyt);
        commit("updateBhyt", bhyt);
      });
      if (!hoTenDaTims.includes(hoTens[index])) {
        try {
          await dispatch(
            "dongBoDuLieu",
            data.result.value.map((i) => i.maSoBhxh).join()
          );
        } catch (error) {}
        hoTenDaTims.push(hoTens[index]);
        localStorage.setItem("hoTens", JSON.stringify(hoTenDaTims));
      }
    } else dispatch("traCuuBhyts", { searchText: hoTens[index], maXa });
  }

  // commit("getAllBhyts", [...bhyts.values()]);
};

export const dongBoDuLieu = async ({ dispatch }, payload) => {
  const maSoBhxhs = [...new Set(payload.split(",")).values()];
  for (let index = 0; index < maSoBhxhs.length; index++) {
    await sleep();
    const maSoBhxh = maSoBhxhs[index];
    try {
      await dispatch("xem", { maSoBhxh });
    } catch (error) {
      console.log(error);
    }
  }
};

export const taiTuc = async ({ commit }, payload) => {
  const maSoBhxhs = payload.split(",");
  for (let index = 0; index < maSoBhxhs.length; index++) {
    const maSoBhxh = maSoBhxhs[index];
    try {
      await dispatch("xem", { maSoBhxh });
    } catch (error) {
      console.log(error);
    }
  }
};

export const giaHan = async ({ commit }, payload) => {
  for (let index = 0; index < payload.length; index++) {
    await sleep();
    const {
      maSoBhxh,
      tongTien,
      maThuTuc,
      soBienLai,
      userId: userName,
    } = payload[index];
    try {
      const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
        tongTien,
        maThuTuc,
        soBienLai,
        userName,
        disabled: true,
        completed: true,
      });
      await commit("updateBhyt", data);
    } catch (error) {
      console.log(error);
    }
  }
};

export const updateTongTien = async ({ commit }, { maSoBhxh, capNhatBHYT }) => {
  try {
    const { data } = await api.put(
      `/api/bhyts/${maSoBhxh}/tong-tien`,
      capNhatBHYT
    );
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const updateGhiChu = async ({ commit }, { maSoBhxh, ghiChu }) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      ghiChu,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const updateMaXacNhan = async (
  { commit },
  {
    maSoBhxh,
    maXacNhan,
    maXacNhanTN,
    ngayLap,
    ngayLapTN,
    soBienLai,
    soBienLaiTN,
  }
) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      maXacNhan,
      maXacNhanTN,
      ngayLap,
      ngayLapTN,
      soBienLai,
      soBienLaiTN,
    });
    await commit("updateBhyt", data);
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
export const updateDenNgayBHYTBT = async (
  { commit },
  { maSoBhxh, denNgayBHYTBT }
) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      denNgayBHYTBT,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};

export const updateDenNgayBHXH = async (
  { commit },
  { maSoBhxh, denThangDt, maPhuongThucDong, mucDong }
) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      denThangDt,
      maPhuongThucDong,
      mucDong,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};

export const huyThuTien = async (
  { commit, dispatch },
  { maSoBhxh, bienLaiId }
) => {
  try {
    const { ngayBienLai } = bienLaiId
      ? await dispatch("maTraCuu", bienLaiId)
      : {};
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      userName: null,
      completed: 0,
      tongTien: 0,
      ngayLap: ngayBienLai?.split("/").reverse().join("-"),
      isBHYT: 0,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const thuTien = async (
  { commit },
  { maSoBhxh, tongTien, userName, tienNop, maXa }
) => {
  try {
    if (tienNop) {
      //Thu BHXH tự nguyện
      const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
        tienNop: tienNop.replace(/\D/g, ""),
        ngayLapTN: new Date().toISOString().slice(0, 10),
        userName,
        completed: 1,
        isBHXHTN: 1,
        maXa,
      });
      await commit("updateBhyt", data);
    } else {
      //Thu BHYT
      const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
        tongTien: tongTien,
        ngayLap: new Date().toISOString().slice(0, 10),
        userName,
        completed: 1,
        isBHYT: 1,
      });
      await commit("updateBhyt", data);
    }
  } catch (error) {
    console.log(error);
  }
};
export const capNhatBienLai = async ({ commit }, payload) => {
  for (let index = 0; index < payload.length; index++) {
    await sleep();
    const { maSoBHXH, ngayBienLai, soBienLai, soTienThu } = payload[index];
    try {
      const { data } = await api.put(`/api/bhyts/${maSoBHXH}/tong-tien`, {
        ngayLap: ngayBienLai,
        soBienLai,
        tongTien: soTienThu,
      });
      await commit("updateBhyt", data);
    } catch (error) {
      console.log(error);
    }
  }
};

export const daXyLy = async ({ commit, dispatch, rootGetters }, payload) => {
  const namNay = new Date().getFullYear();
  const thangNay = `${namNay}-${new Date().getMonth()}`;
  for (let index = 0; index < payload.length; index++) {
    const {
      maSoBhxh,
      tongTien,
      userId: userName,
      trangThaiHoSo,
      maThuTuc,
      soBienLai,
      bienLaiId,
    } = payload[index];
    if (trangThaiHoSo != 5) {
      if (maThuTuc === 0) {
        try {
          const { maXacNhan, ngayBienLai, maTraCuu } = await dispatch(
            "maTraCuu",
            bienLaiId
          );
          const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
            tienNop: tongTien,
            userName,
            isBHXHTN: 0, // đã nộp bhxhtn
            soBienLaiTN: maTraCuu,
            maXacNhanTN: maXacNhan,
            bienLaiIdTN: bienLaiId,
            // disabled: 0,
            completed:
              rootGetters["auth/userName"] == userName
                ? trangThaiHoSo !== 9
                : false,
            maThuTuc,
            ngayLapTN: ngayBienLai?.split("/").reverse().join("-"),
            maXa: rootGetters["auth/maXa"],
          });
          await commit("updateBhyt", data);
          if (
            trangThaiHoSo === 9 &&
            data.denThangDt &&
            data.denThangDt.slice !== thangNay
          ) {
            await dispatch("getTraCuuThongTinBHXHTN", maSoBhxh);
          }
          if (!data.hoTen) {
            await dispatch("xem", { maSoBhxh });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const { maXacNhan, ngayBienLai, maTraCuu } = await dispatch(
            "maTraCuu",
            bienLaiId
          );
          // console.log(
          //   rootGetters["auth/userName"],
          //   rootGetters["auth/userName"] == userName
          // );
          const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
            tongTien,
            isBHYT: 0, //Đã nộp bhyt
            userName,
            maXacNhan: maXacNhan,
            soBienLai: maTraCuu,
            bienLaiId,
            // disabled: 0,
            completed:
              rootGetters["auth/userName"] == userName
                ? trangThaiHoSo !== 9
                : false,
            maThuTuc,
            ngayLap: ngayBienLai?.split("/").reverse().join("-"),
          });
          await commit("updateBhyt", data);

          if (
            !data.hoTen ||
            !data.denNgayDt ||
            (trangThaiHoSo === 9 &&
              parseInt(data.denNgayDt.slice(0, 4)) <= namNay)
          ) {
            await dispatch("xem", { maSoBhxh });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    await sleep();
  }
};

export const getAllBhyts = async ({ commit }, payload) => {
  const {
    completed,
    disabled,
    name,
    thang,
    maHoGd,
    chuaDongBo,
    taiTuc,
    hetHan,
    maXa,
    uniqid,
  } = payload;

  let url = "/api/bhyts?";
  if (thang) url += `thang=${thang}`;
  if (maXa) url += `&maXa=${maXa}`;
  if (taiTuc) url += `&taiTuc=${taiTuc}`;
  if (hetHan) url += `&hetHan=${hetHan}`;
  if (name) url += `&name=${name}`;
  if (completed) url += `&completed=${completed}`;
  if (disabled) url += `&disabled=${disabled}`;
  if (maHoGd) url += `&maHoGd=${maHoGd}`;
  if (chuaDongBo) url += `&chuaDongBo=${chuaDongBo}`;
  if (uniqid) url += `&uniqid=${uniqid}`;

  const { data } = await api.get(url);

  if (data) commit("getAllBhyts", data);
};

export const getAllBhyts2 = async ({ commit }, payload) => {
  const {
    completed,
    disabled,
    name,
    thang,
    maHoGd,
    chuaDongBo,
    taiTuc,
    hetHan,
    maXa,
  } = payload;

  let url = "https://cmsbudientulap.herokuapp.com/api/bhyts?";
  if (thang) url += `thang=${thang}`;
  if (maXa) url += `&maXa=${maXa}`;
  if (taiTuc) url += `&taiTuc=${taiTuc}`;
  if (hetHan) url += `&hetHan=${hetHan}`;
  if (name) url += `&name=${name}`;
  if (completed) url += `&completed=${completed}`;
  if (disabled) url += `&disabled=${disabled}`;
  if (maHoGd) url += `&maHoGd=${maHoGd}`;
  if (chuaDongBo) url += `&chuaDongBo=${chuaDongBo}`;

  const { data } = await client.get(url);

  if (data) commit("getAllBhyts", data);
};

export const findBhyts = async ({ searchText, isLogin }) => {
  // console.log(isLogin);
  const { data } = await client.getSsm(
    `/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=08986&hoTen=${searchText}&isCoDau=true&`,
    isLogin
  );
  if (data) return data.result.value.map((x) => x.maSoBhxh);
  else return [];
};

export const getBhytSsm = async ({ maSoBhxh, isLogin }) => {
  const { data } = await client.getSsm(
    `/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh}`,
    isLogin
  );
  if (data)
    return { ...data.result.thongTinTheHGD, maHoGd: data.thongTinTK1.maHoGd };
  else return {};
};

export const updateBhyt = async (bhyt) => {
  const { data } = await api.put(`/api/bhyts/${bhyt.maSoBhxh}`, bhyt);
  console.log(bhyt);
  return data;
};

export const lamMoiDanhSach = () => commit("getAllBhyts", []);

export const loaiBo = async ({ commit }, { maSoBhxh, disabled }) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/disabled`, {
    disabled: !(disabled == "1"),
  });
  commit("updateBhyt", data);
};

export const theoDoi = async (
  { commit, rootGetters },
  { maSoBhxh, completed }
) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/completed`, {
    completed: !(completed == "1"),
    maXa: rootGetters["auth/maXa"],
    userName: rootGetters["auth/userName"],
  });
  commit("updateBhyt", data);
};

export const huyThuBHYT = async ({ commit }, { maSoBhxh, userName }) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/huy-thu-bhyt`, {
    isBHYT: 0,
    completed: 0,
    userName,
    ngayLap: null,
  });
  commit("updateBhyt", data);
};
export const huyThuBHXHTN = async ({ commit }, { maSoBhxh, userName }) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/huy-thu-bhxhtn`, {
    isBHXHTN: 0,
    completed: 0,
    userName,
    ngayLapTN: null,
  });
  commit("updateBhyt", data);
};

export const copyHoTenToClipboard = ({ state }) => {
  navigator.clipboard.writeText(state.bhyts.map((bhyt) => bhyt.hoTen)).then(
    function () {
      Notify.create({
        type: "positive",
        message: `Bạn đã sao chép thành công!`,
      });
    },
    function (err) {
      Notify.create({
        type: "negative",
        message: "Không thực hiện được!" + err,
      });
    }
  );
};

// Chức năng mới xây dựng

export async function traCuuBHXH({ commit }, maSoBHXH) {
  try {
    const response = await api.get(`/api/bhyts/tra-cuu-bhyt/${maSoBHXH}`);
    // Commit mutation để cập nhật thông tin BHYT trong Vuex store
    commit("capNhatThongTinBhyt", response.data);
  } catch (error) {
    // Hiển thị thông báo lỗi bằng Quasar notification
    Notify.create({
      type: "negative",
      message: "Lỗi tra cứu BHXH: " + error.message,
      timeout: 2000, // Thời gian hiển thị thông báo (mili giây)
    });
    // Bạn có thể commit một mutation để cập nhật trạng thái lỗi trong Vuex
    // commit('setError', error.message);
  }
}

export async function traCuuMaSoBHXH(
  { commit },
  { maTinh, maHuyen, maXa, hoTen }
) {
  try {
    const { data } = await api.get(
      `/api/tim-kiem-bhyts?maTinh=${maTinh}&maHuyen=${maHuyen}&maXa=${maXa}&hoTen=${hoTen}`
    );

    if (data.data.length) {
      data.data.forEach((bhyt) => commit("capNhatThongTinBhyt", bhyt));
    }

    // Commit mutation để cập nhật thông tin BHYT trong Vuex store
    // commit("capNhatThongTinBhyt", response.data);
  } catch (error) {
    // Hiển thị thông báo lỗi bằng Quasar notification
    Notify.create({
      type: "negative",
      message: "Lỗi tra cứu BHXH: " + error.message,
      timeout: 2000, // Thời gian hiển thị thông báo (mili giây)
    });
    // Bạn có thể commit một mutation để cập nhật trạng thái lỗi trong Vuex
    // commit('setError', error.message);
  }
}
