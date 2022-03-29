import client from "../../utils";

export const xoaHoGd = async ({ commit }, payload) => {
  await client.get(`/api/xoaHoGd?maHoGd=${payload}`);
};

export const getAllBhyts = async ({ commit }, payload) => {
  const {
    startDate,
    endDate = startDate,
    completed,
    disabled,
    name,
    page,
    thang,
    maHoGd,
  } = payload;

  let url = "/api/bhyts?";
  if (page) url += `page=${page}`;
  if (thang) url += `thang=${thang}`;
  if (name) url += `&name=${name}`;
  if (startDate)
    url += `&appointments[]=${startDate}&appointments[]=${endDate}`;
  if (completed) url += `&completed=${completed}`;
  if (disabled) url += `&disabled=${disabled}`;
  if (maHoGd) url += `&maHoGd=${maHoGd}`;

  const { data } = await client.get(url);

  if (data) commit("getAllBhyts", data);
};

export const findBhyts = async ({ searchText, isLogin }) => {
  console.log(isLogin);
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
