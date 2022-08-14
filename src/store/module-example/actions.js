import client from "../../utils";
import axios from "axios";
import moment from "moment";
import { Loading, QSpinnerIos } from "quasar";

const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, 300));
};

export const XuatD03OrD05Excel = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const { data } = await client.post(
    "https://ssm-api.vnpost.vn/api/services/app/KeKhai/XuatD03OrD05Excel",
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
    "https://ssm-api.vnpost.vn/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
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
export const hoSoChuaXuLy = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const denNgay = new Date();
  denNgay.setDate(denNgay.getDate() + 2);
  const tuNgay = new Date();
  tuNgay.setDate(denNgay.getDate() - 32);
  const { data } = await client.post(
    "https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup",
    {
      dateForm: "ngayLap",
      denNgay,
      filterItems: [],
      hoSoChuaThuTien: false,
      hoSoQuaHan: 0,
      keyMenu: "2",
      mangLuoiId: 4580,
      maxResultCount: 500,
      skipCount: 0,
      tuNgay,
    }
  );
  commit("getAllBhyts", [...data.result.items]);
  Loading.hide();
};

export const hoSoDaXuLy = async ({ commit }, payload) => {
  const { thangTruoc = 0 } = payload;
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const denNgay = moment()
    .startOf("months")
    .add(1 - thangTruoc, "months")
    .format();
  const tuNgay = moment()
    .startOf("months")
    .subtract(thangTruoc, "months")
    .format();

  const { data } = await client.post(
    "https://ssm-api.vnpost.vn/api/services/app/KeKhai/TraCuuNoGroup",
    {
      dateForm: "ngayLap",
      denNgay,
      filterItems: [],
      hoSoChuaThuTien: false,
      hoSoQuaHan: 0,
      keyMenu: "1",
      mangLuoiId: 4580,
      maxResultCount: 500,
      skipCount: 0,
      tuNgay,
    }
  );
  commit("getAllBhyts", [...data.result.items]);
  Loading.hide();
};

export const xoaHoGd = async ({ commit }, payload) => {
  await client.get(`/api/xoaHoGd?maHoGd=${payload}`);
};

export const luuBhyt = async (bhyt) => {
  let { data } = await axios.post(
    "https://cms.buudienhuyenmelinh.vn/api/bhyts",
    bhyt
  );
  return data;
};
export const xem = async (maSoBhxh, completed) => {
  let { data } = await axios.get(
    `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh.slice(
      maSoBhxh.length - 10
    )}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("setIsLogin")}`,
      },
    }
  );

  const { thongTinTK1, thongTinTheHGD, trangThaiThe } = data.result;

  const theBHYT = await luuBhyt({
    ...thongTinTheHGD,
    ...thongTinTK1,
    ...trangThaiThe,
  });
  return theBHYT;
};

export const traCuuTheoTen = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const hoTens = payload.split(",");
  const bhyts = new Map();
  for (let index = 0; index < hoTens.length; index++) {
    let url = `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=08986&hoTen=${hoTens[index]}&isCoDau=true&`;
    let { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("setIsLogin")}`,
      },
    });
    data.result.value.forEach((bhyt) => {
      bhyts.set(bhyt.maSoBhxh, bhyt);
    });
  }

  commit("getAllBhyts", [...bhyts.values()]);
  Loading.hide();
};
export const dongBoDuLieu = async ({ commit }, payload) => {
  const maSoBhxhs = payload.split(",");
  for (let index = 0; index < maSoBhxhs.length; index++) {
    await sleep();
    const maSoBhxh = maSoBhxhs[index];
    try {
      const bhyt = await xem(maSoBhxh, false);
      await commit("updateBhyt", bhyt);
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
      const bhyt = await xem(maSoBhxh, true);
      await commit("updateBhyt", bhyt);
    } catch (error) {
      console.log(error);
    }
  }
};

export const giaHan = async ({ commit }, payload) => {
  for (let index = 0; index < payload.length; index++) {
    await sleep();
    const { maSoBhxh, tongTien, ngayLap } = payload[index];
    try {
      const { data } = await client.put(
        `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          disabled: true,
          completed: true,
        }
      );
      await commit("updateBhyt", data);
    } catch (error) {
      console.log(error);
    }
  }
};

export const daXyLy = async ({ commit }, payload) => {
  for (let index = 0; index < payload.length; index++) {
    await sleep();
    const { maSoBhxh, tongTien, ngayLap, userName, trangThaiHoSo } =
      payload[index];
    try {
      const { data } = await client.put(
        `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          userName,
          disabled: trangThaiHoSo !== 9,
          completed: trangThaiHoSo !== 9,
        }
      );
      await commit("updateBhyt", data);
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

  let url = "https://cms.buudienhuyenmelinh.vn/api/bhyts?";
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
    `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuMaSoBHXH?maTinh=01&maHuyen=250&maXa=08986&hoTen=${searchText}&isCoDau=true&`,
    isLogin
  );
  if (data) return data.result.value.map((x) => x.maSoBhxh);
  else return [];
};

export const getBhytSsm = async ({ maSoBhxh, isLogin }) => {
  const { data } = await client.getSsm(
    `https://ssm-api.vnpost.vn/api/services/app/TraCuu/TraCuuThongTinBHYT?maSoBhxh=${maSoBhxh}`,
    isLogin
  );
  if (data)
    return { ...data.result.thongTinTheHGD, maHoGd: data.thongTinTK1.maHoGd };
  else return {};
};

export const updateBhyt = async (bhyt) => {
  const { data } = await client.put(
    `https://cms.buudienhuyenmelinh.vn/api/bhyts/${bhyt.maSoBhxh}`,
    bhyt
  );
  return data;
};

export const lamMoiDanhSach = () => commit("getAllBhyts", []);

export const loaiBo = async ({ commit }, { maSoBhxh, disabled }) => {
  const { data } = await client.put(
    `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/disabled`,
    {
      disabled: !disabled == 0,
    }
  );
  commit("updateBhyt", data);
};

export const theoDoi = async ({ commit }, { maSoBhxh, completed }) => {
  // console.log(maSoBhxh, completed);
  const { data } = await client.put(
    `https://cms.buudienhuyenmelinh.vn/api/bhyts/${maSoBhxh}/completed`,
    {
      completed: !completed == 0,
    }
  );
  commit("updateBhyt", data);
};
