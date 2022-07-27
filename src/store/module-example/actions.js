import client from "../../utils";
import axios from "axios";
import moment from "moment";
import { Loading, QSpinnerIos } from "quasar";
import { async } from "@firebase/util";
let bhyts = [];

export const XuatD03OrD05Excel = async ({ commit }, payload) =>{
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const { data } = await client.post(
    "https://ssm-api.vnpost.vn/api/services/app/KeKhai/XuatD03OrD05Excel",
    {
      daiLyIds: [
          52401
      ],
      transactionIds: payload
  }
  );
  Loading.hide();

  return data.result;
}

export const khachChuaNop = async ({ commit }, payload) => {
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  // const denThang = new Date();
  // const tuThang = new Date();
  // tuThang.setDate(1);
  // denThang.setMonth(denThang.getMonth() + 1);
  const { data } = await client.post(
    "https://ssm-api.vnpost.vn/api/services/app/BaoCaoTongHopGDThu/DanhSachKhachHangTaiTuc",
    {
      denThang: moment().startOf('months').add(1,'months').format(),
      filterItems: [],
      loaiDichVu: 1,
      mangLuoiId: 4580,
      maxResultCount: 1500,
      skipCount: 0,
      tuThang: moment().startOf('months').format(),
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
  denNgay.setDate(denNgay.getDate()+2);
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
  const {thangTruoc = 0} = payload;
  Loading.show({
    spinner: QSpinnerIos,
    spinnerSize: "100px",
  });
  const denNgay = moment().startOf('months').add(1-thangTruoc,'months').format();
  const tuNgay = moment().startOf('months').subtract(thangTruoc,'months').format();

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

const timKiem = async (searchText, completed = false) => {
  if (searchText.length === 0 || localStorage.getItem("setIsLogin") === "")
    return [];
  bhyts = [];
  const maSoBhxhs = searchText.split(",");
  for (let index = 0; index < maSoBhxhs.length; index++) {
    const maSoBhxh = maSoBhxhs[index];
    try {
      await xem(maSoBhxh, completed);
    } catch (error) {
      console.log(error);
    }
  }
  return bhyts;
};

export const luuBhyt = async (bhyt) => {
  let { data } = await axios.put(
    `https://cmsbudientulap.herokuapp.com/api/bhyts/${bhyt.maSoBhxh}`,
    bhyt
  );
  await axios.put(
    `https://cmstulap.herokuapp.com/api/bhyts/${bhyt.maSoBhxh}`,
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

  let { thongTinTheHGD } = data.result;
  if (!thongTinTheHGD) {
    thongTinTheHGD = {
      ngay5Nam: data.result.typeId
        ? data.result.typeId
        : data.result.trangThaiThe.moTa,
      maSoBhxh,
    };
  }
  let theBHYT = {};
  if (data.result.thongTinTK1)
    theBHYT = await luuBhyt({
      ...thongTinTheHGD,
      ...data.result.thongTinTK1,
      completed,
    });
  else theBHYT = await luuBhyt({ ...thongTinTheHGD, completed });
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
    data.result.value.forEach(bhyt => {
      bhyts.set(bhyt.maSoBhxh,bhyt);
    });
  }
  
  commit("getAllBhyts", [...bhyts.values()]);
  Loading.hide();
};
export const dongBoDuLieu = async ({ commit }, payload) => {
  const maSoBhxhs = payload.split(",");
  for (let index = 0; index < maSoBhxhs.length; index++) {
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
    const {maSoBhxh, tongTien, ngayLap} = payload[index];
    try {
      const { data } = await client.put(
        `https://cmsbudientulap.herokuapp.com/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          disabled: true,
          completed: true
        }
      );
      await client.put(
        `https://cmstulap.herokuapp.com/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          disabled: true,
          completed: true
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
    const {maSoBhxh, tongTien, ngayLap, userName, trangThaiHoSo} = payload[index];
    try {
      const { data } = await client.put(
        `https://cmsbudientulap.herokuapp.com/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          userName,
          disabled: trangThaiHoSo !== 9,
          completed: trangThaiHoSo !==9
        }
      );
      await client.put(
        `https://cmstulap.herokuapp.com/api/bhyts/${maSoBhxh}/tong-tien`,
        {
          tongTien,
          ngayLap,
          userName,
          disabled: trangThaiHoSo !== 9,
          completed: trangThaiHoSo !==9
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
  } = payload;

  let url = "https://cmsbudientulap.herokuapp.com/api/bhyts?";
  if (thang) url += `thang=${thang}`;
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
  } = payload;

  let url = "https://cmstulap.herokuapp.com/api/bhyts?";
  if (thang) url += `thang=${thang}`;
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
    `https://cmsbudientulap.herokuapp.com/api/bhyts/${bhyt.maSoBhxh}`,
    bhyt
  );
  return data;
};

export const lamMoiDanhSach = () => commit("getAllBhyts", []);

export const loaiBo = async ({ commit }, { maSoBhxh, disabled }) => {
  // console.log(maSoBhxh, disabled);
  const { data } = await client.put(
    `https://cmsbudientulap.herokuapp.com/api/bhyts/${maSoBhxh}/disabled`,
    {
      disabled: !disabled,
    }
  );
  commit("updateBhyt", data);
};

export const theoDoi = async ({ commit }, { maSoBhxh, completed }) => {
  // console.log(maSoBhxh, completed);
  const { data } = await client.put(
    `https://cmsbudientulap.herokuapp.com/api/bhyts/${maSoBhxh}/completed`,
    {
      completed: !completed,
    }
  );
  commit("updateBhyt", data);
};
