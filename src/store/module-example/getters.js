import state from "./state";

export function bhyts(state) {
  return state.bhyts;
}

export const timBhyts = (state) => (searchText) => {
  if (!searchText) return state.bhyts;
  return [
    ...state.bhyts.filter((item) =>
      (
        item.hoTen +
        item.maSoBhxh +
        item.maHoGd +
        item.soDienThoai +
        item.maKCB +
        "-" +
        item.denNgayDt
      )
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ),
  ];
};

export const soDienThoais = (state) => {
  return state.bhyts.map((bhyt) => bhyt.soDienThoai);
};
