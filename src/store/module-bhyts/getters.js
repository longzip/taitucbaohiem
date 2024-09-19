export function bhyts(state) {
  return state.bhyts;
}
export function getCurrentBhyt(state) {
  return state.currentBhyt;
}

export const filteredBhyts = ({ searchText, selectedUser, bhyts }) => {
  let filtered = bhyts;
  const term = searchText.toLowerCase().trim();
  if (term) {
    filtered = filtered.filter((bhyt) => {
      return (
        `${bhyt.hoTen} ${bhyt.ngaySinhDt} ${bhyt.maSoBhxh} ${bhyt.soTheBhyt}`
          .toLowerCase()
          ?.includes(term) ||
        bhyt.ghiChu?.includes(term) ||
        bhyt.userName?.includes(term)
      );
    });
  }
  if (selectedUser) {
    filtered = filtered.filter((bhyt) => bhyt.userName == selectedUser);
  }
  return filtered;
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
