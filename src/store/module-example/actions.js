import client from "../../utils";
import axios from "axios";

let bhyts = [];

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
      ngay5Nam: data.result.typeId,
      maSoBhxh,
    };
  }
  let theBHYT = {};
  if (data.result.thongTinTK1)
    theBHYT = await luuBhyt({
      ...thongTinTheHGD,
      maHoGd: data.result.thongTinTK1.maHoGd,
      completed,
    });
  else theBHYT = await luuBhyt({ ...thongTinTheHGD, completed });
  bhyts.push(theBHYT);
};

export const dongBoDuLieu = async ({ commit }, payload) => {
  const bhyts = await timKiem(payload);
  commit("getAllBhyts", [...bhyts]);
};

export const taiTuc = async ({ commit }, payload) => {
  const bhyts = await timKiem(payload, true);
  commit("getAllBhyts", [...bhyts]);
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

  let url = "/api/bhyts?";
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
  const { data } = await client.put(`/api/bhyts/${bhyt.maSoBhxh}`, bhyt);
  return data;
};

export const lamMoiDanhSach = () => commit("getAllBhyts", []);

export const loaiBo = async ({ commit }, { maSoBhxh, disabled }) => {
  // console.log(maSoBhxh, disabled);
  const { data } = await client.put(`/api/bhyts/${maSoBhxh}/disabled`, {
    disabled: !disabled,
  });
  commit("updateBhyt", data);
};

export const theoDoi = async ({ commit }, { maSoBhxh, completed }) => {
  // console.log(maSoBhxh, completed);
  const { data } = await client.put(`/api/bhyts/${maSoBhxh}/completed`, {
    completed: !completed,
  });
  commit("updateBhyt", data);
};
