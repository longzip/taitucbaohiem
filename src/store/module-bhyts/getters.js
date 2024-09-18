export function bhyts(state) {
  return state.bhyts;
}

export const filteredBhyts = (state) => (searchTerm) => {
  if (!searchTerm) return state.bhyts;
  const term = searchTerm.toLowerCase();
  return state.bhyts.filter((bhyt) => {
    return (
      `${bhyt.hoTen} ${bhyt.ngaySinhDt}`.toLowerCase()?.includes(term) ||
      bhyt.soDienThoai2?.includes(term) ||
      bhyt.soDienThoai?.includes(term) ||
      bhyt.cmnd?.includes(term)
    );
  });
};

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
        item.soBienLai +
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
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .map((t) => t.tongTien || t.soTienThu || 0)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};
export const tongTienBHYTDaThu = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .filter((b) => b.isBHYT == 1)
    .map((t) => t.tongTien)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};
export const tongTienBHXHDaThu = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .filter((b) => b.isBHXHTN == 1)
    .map((t) => t.tienNop)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};

export const tongTienBHYT = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .map((t) => t.tongTien || 0)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};
export const tongTienBHXH = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .map((t) => t.tienNop || 0)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};

export const tongMucDongBHXH = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .map((t) => t.mucDong || 0)
    .reduce(
      (previousValue, currentValue) => previousValue + parseInt(currentValue),
      0
    );
};

export const tongSoBHXH = (state) => {
  if (state.bhyts.length === 0) return 0;
  return state.bhyts
    .filter((t) => t.mucDong)
    .reduce((previousValue, currentValue) => previousValue + 1, 0);
};

export const tongSoThe = (state) => {
  return state.bhyts.length;
};
