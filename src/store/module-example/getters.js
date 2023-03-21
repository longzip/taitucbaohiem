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
        item.hoVaTen +
        item.maSoBhxh +
        item.maHoGd +
        item.soDienThoai +
        item.maKCB +
        item.soBienLai+
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

export const tongTien = (state) => {
  if(state.bhyts.length === 0) return 0;
  return state.bhyts
        .map((t) => t.tongTien || t.soTienThu)
        .reduce(
          (previousValue, currentValue) =>
            previousValue + parseInt(currentValue),
          0
  );
}

export const tongSoThe = (state) => {
  return state.bhyts.length;
}
