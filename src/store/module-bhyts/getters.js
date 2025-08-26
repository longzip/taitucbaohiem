export function bhyts(state) {
  return state.bhyts;
}
export function getCurrentBhyt(state) {
  return state.currentBhyt;
}

export const filteredBhyts = ({
  searchText,
  selectedUser,
  selectedStatus,
  bhyts,
}) => {
  let filtered = bhyts;
  const term = searchText.toLowerCase().trim();
  if (term) {
    filtered = filtered.filter((bhyt) => {
      return (
        `${bhyt.hoTen} ${bhyt.ngaySinhDt}`.toLowerCase()?.includes(term) ||
        bhyt.maSoBhxh?.includes(term) ||
        bhyt.soCmnd?.includes(term) ||
        bhyt.soTheBhyt?.toLowerCase()?.includes(term) ||
        bhyt.soDienThoai?.includes(term) ||
        bhyt.soDienThoai2?.includes(term) ||
        bhyt.ghiChu?.toLowerCase()?.includes(term) ||
        bhyt.mqhChuHo?.toLowerCase()?.includes(term) ||
        bhyt.userName?.includes(term)
      );
    });
  }
  if (selectedUser) {
    filtered = filtered.filter((bhyt) => bhyt.userName == selectedUser);
  }
  if (selectedUser === "") {
    filtered = filtered.filter((bhyt) => !bhyt.userName);
  }

  // *** Bổ sung: Lọc theo trạng thái đã chọn ***
  if (selectedStatus) {
    if (selectedStatus === "Chưa tái tục") {
      // Giả sử bạn có một trạng thái như vậy

      // --- Bắt đầu logic mới ---
      const today = new Date();
      const lastDayOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        0
      );

      filtered = filtered.filter((bhyt) => {
        const expirationDate = new Date(bhyt.denNgayDt);
        return expirationDate < lastDayOfNextMonth; // Thêm điều kiện >= today để chỉ lấy các thẻ chưa hết hạn
      });
      // --- Kết thúc logic mới ---
    } else if (selectedStatus === "Chưa đồng bộ") {
      // --- Bắt đầu logic mới ---
      const today = new Date();
      const threeMonthsAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate()
      );

      filtered = filtered.filter((bhyt) => {
        return (
          bhyt.ngayTraCuu === "0000-00-00 00:00:00" ||
          new Date(bhyt.ngayTraCuu) < threeMonthsAgo
        );
      });
      // --- Kết thúc logic mới ---
    } else {
      filtered = filtered.filter(
        (bhyt) =>
          bhyt.trangThaiTaiTuc === selectedStatus ||
          bhyt.trangThaiHoSoName == selectedStatus
      );
    }
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
    .filter((t) => t.tienNop > 0)
    .reduce((previousValue, currentValue) => previousValue + 1, 0);
};

export const tongSoThe = (state) => {
  return state.bhyts.length;
};
