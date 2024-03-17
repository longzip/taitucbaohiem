import client from "../../utils";
import moment from "moment";
import { Loading, QSpinnerIos, Notify } from "quasar";
import { api, apiServices } from "src/boot/axios";

const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

export const batTatRemove = ({ commit }, payload) => {
  commit("setIsRemove", payload);
};
export const xoaThanhVienHGD = ({ commit }, payload) => {
  commit("removeBhyt", payload);
};

export const getTraCuuThongTinBHXHTN = async ({}, payload) => {
  try {
    const { data } = await apiServices.get(
      `/api/services/app/TraCuu/TraCuuThongTinBHXHTN?maSoBhxh=${payload}`
    );
    await commit("saveBHXHTN", data.result.value.thongTinTns[0]);
    return data.result.value.thongTinTns[0];
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
  }
  return {};
};

export const saveBHXHTN = async (
  { commit },
  { maSoBhxh, mucDong, maPhuongThucDong, thangBd }
) => {
  const t = { 1: 1, 3: 3, 6: 4, 12: 7 };

  const { data: bhytUpdate } = await api.put(
    `/api/bhyts/${maSoBhxh}/tong-tien`,
    {
      isBHXHTN: 1,
      denThangDt: moment(thangBd)
        .add(t[maPhuongThucDong] - 1, "months")
        .endOf("month")
        .format()
        .slice(0, 10),
      mucDong,
    }
  );
  await commit("updateBhyt", bhytUpdate);
};
export const getDanhSachKhachHangTaiTuc = async ({ commit }, payload) => {
  commit("setBhyts", []);
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  try {
    const { data } = await apiServices.post(
      "/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
      payload
    );
    commit("setBhyts", data.result.items);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: `Đã xảy ra lỗi!`,
    });
  }
  Loading.hide();
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
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
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
  Loading.hide();
};

export const traCuuBhyts = async ({ commit }, payload) => {
  commit("setBhyts", []);
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
    isBHXHTN,
    taiTucBHXH,
    soBienLai,
  } = payload;

  let url = "/api/bhyts?";
  if (thang) url += `thang=${thang}`;
  if (maXa) url += `&maXa=${maXa}`;
  if (taiTuc) url += `&taiTuc=${taiTuc}`;
  if (hetHan) url += `&hetHan=${hetHan}`;
  if (name) url += `&name=${name}`;
  if (nam) url += `&nam=${nam}`;
  if (userName) url += `&userName=${userName}`;
  if (completed) url += `&completed=${completed}`;
  if (disabled) url += `&disabled=${disabled}`;
  if (maHoGd) url += `&maHoGd=${maHoGd}`;
  if (chuaDongBo) url += `&chuaDongBo=${chuaDongBo}`;
  if (isBHXHTN) url += `&isBHXHTN=${isBHXHTN}`;
  if (taiTucBHXH) url += `&taiTucBHXH=${taiTucBHXH}`;
  if (soBienLai) url += `&soBienLai=${soBienLai}`;
  const { data } = await api.get(url);
  commit("setBhyts", data);
};

export const XuatD03OrD05Excel = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const { data } = await client.post(
    "/api/services/app/KeKhai/XuatD03OrD05Excel",
    {
      daiLyIds: [52401],
      transactionIds: payload,
    }
  );
  Loading.hide();

  return data.result;
};

export const khachChuaNop = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const { data } = await client.post(
    "/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
    {
      denThang: moment().startOf("months").add(1, "months").format(),
      filterItems: [],
      loaiDichVu: 1,
      mangLuoiId: 4580,
      maxResultCount: 1500,
      skipCount: 0,
      tuThang: moment().startOf("months").format(),
      type: -1,
    }
  );
  commit("getAllBhyts", [...data.result.items.reverse()]);
  Loading.hide();
};

export const hoSoChuaXuLy = async ({ commit }, { mangLuoiId = 4580 }) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
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
    maxResultCount: 500,
    skipCount: 0,
    tuNgay,
  });
  commit("getAllBhyts", [...data.result.items]);
  Loading.hide();
};

export const hoSoDaXuLy = async ({ commit }, payload) => {
  let { thangTruoc = 0, tuNgay, denNgay, mangLuoiId = 4580 } = payload;
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
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
    keyMenu: "1",
    mangLuoiId,
    maxResultCount: 500,
    skipCount: 0,
    tuNgay,
  });
  commit("getAllBhyts", [...data.result.items]);
  Loading.hide();
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

export const xem = async ({ commit }, maSoBhxh) => {
  let {
    data: { result },
  } = await client.get(
    `/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
      maSoBhxh.length - 10
    )}`
  );

  const { thongTinTK1, thongTinTheHGD, trangThaiThe } = result;

  const theBHYT = await luuBhyt({
    ...thongTinTheHGD,
    ...thongTinTK1,
    ...trangThaiThe,
  });
  await commit("updateBhyt", {
    ...thongTinTheHGD,
    ...trangThaiThe,
    ...theBHYT,
  });
};

export const traCuuTheoTen = async (
  { commit, dispatch },
  { name, maXa, maHuyen, maTinh }
) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
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
    }
  }

  // commit("getAllBhyts", [...bhyts.values()]);
  Loading.hide();
};

export const dongBoDuLieu = async ({ dispatch }, payload) => {
  const maSoBhxhs = payload.split(",");
  for (let index = 0; index < maSoBhxhs.length; index++) {
    await sleep();
    const maSoBhxh = maSoBhxhs[index];
    try {
      await dispatch("xem", maSoBhxh);
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
      await dispatch("xem", maSoBhxh);
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
  { maSoBhxh, maXacNhan, ngayLap }
) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      maXacNhan,
      ngayLap,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const updateNgayLap = async ({ commit }, { maSoBhxh, ngayLap }) => {
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      ngayLap,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const thuTien = async (
  { commit },
  { maSoBhxh, tongTien, userName, disabled }
) => {
  tongTien = tongTien.replace(/\D/g, "");
  try {
    const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
      tongTien,
      ngayLap: new Date().toISOString().slice(0, 10),
      userName: tongTien ? userName : null,
      disabled,
    });
    await commit("updateBhyt", data);
  } catch (error) {
    console.log(error);
  }
};
export const capNhatBienLai = async ({ commit }, payload) => {
  for (let index = 0; index < payload.length; index++) {
    await sleep();
    const { maSoBHXH, ngayBienLai, bienLaiId, soBienLai, soTienThu } =
      payload[index];
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

export const daXyLy = async ({ commit, dispatch }, payload) => {
  const mucDongBHYT = [972000, 680400, 583200, 486000, 388800];
  for (let index = 0; index < payload.length; index++) {
    await sleep();

    const {
      maSoBhxh,
      tongTien,
      userId: userName,
      trangThaiHoSo,
      maThuTuc,
      soBienLai,
      bienLaiId,
    } = payload[index];

    try {
      const { data } = await api.put(`/api/bhyts/${maSoBhxh}/tong-tien`, {
        tongTien,
        userName,
        maThuTuc,
        soBienLai,
        bienLaiId,
        disabled: trangThaiHoSo !== 9,
      });

      if (!mucDongBHYT.includes(tongTien) && trangThaiHoSo === 9) {
        await dispatch("getTraCuuThongTinBHXHTN", maSoBhxh);
      }
      if (!data.hoTen || trangThaiHoSo === 9) {
        await dispatch("xem", maSoBhxh);
      } else await commit("updateBhyt", data);
    } catch (error) {
      console.log(error);
    }
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
  return data;
};

export const lamMoiDanhSach = () => commit("getAllBhyts", []);

export const loaiBo = async ({ commit }, { maSoBhxh, disabled }) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/disabled`, {
    disabled: !(disabled == "1"),
  });
  commit("updateBhyt", data);
};

export const theoDoi = async ({ commit }, { maSoBhxh, completed }) => {
  const { data } = await api.put(`/api/bhyts/${maSoBhxh}/completed`, {
    completed: !(completed == "1"),
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
