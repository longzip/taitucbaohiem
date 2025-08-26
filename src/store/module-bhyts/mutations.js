export function SET_CURRENT_BHYT(state, bhyt) {
  state.currentBhyt = bhyt;
}
export function SET_SEARCH_TEXT(state, text) {
  state.searchText = text;
}
export function SET_SELECTED_USER(state, user) {
  state.selectedUser = user;
}
export function SET_SELECTED_STATUS(state, status) {
  state.selectedStatus = status;
}
export const setSearchText = (state, payload) => {
  state.searchText = payload;
};
export const setSelectedUser = (state, payload) => {
  state.selectedUser = payload;
};
export const setBhyts = (state, payload) => {
  state.bhyts = payload;
};
export const setIsRemove = (state, payload) => {
  state.isRemove = !state.isRemove;
};
export const setMaXa = (state, payload) => {
  state.maXa = payload;
};

export const getAllBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const removeBhyt = (state, payload) => {
  const index = state.bhyts.findIndex((key) => key.maSoBhxh === payload);
  state.bhyts.splice(index, 1);
};

export const updateBhyt = (state, payload) => {
  if (state.isRemove) {
    const index = state.bhyts.findIndex(
      (x) => x.maSoBhxh === payload.maSoBhxh || x.maSoBHXH === payload.maSoBhxh
    );
    if (index !== -1) {
      state.bhyts.splice(index, 1);
    }
    return null;
  }
  let found = state.bhyts.find(
    (x) => x.maSoBhxh === payload.maSoBhxh || x.maSoBHXH === payload.maSoBhxh
  );
  if (found) Object.assign(found, payload);
  else state.bhyts.unshift(payload);
};

// Mới xây dựng lại

export const capNhatThongTinBhyt = (state, payload) => {
  // Tìm BHYT trong mảng bhyts dựa trên maSoBhxh hoặc maSoBHXH
  let found = state.bhyts.find(
    (x) => x.maSoBhxh === payload.maSoBhxh || x.maSoBHXH === payload.maSoBhxh
  );

  // Nếu tìm thấy BHYT, cập nhật thông tin của BHYT đó bằng thông tin mới trong payload
  if (found) {
    Object.assign(found, payload);
  } else {
    // Nếu không tìm thấy, thêm BHYT mới vào đầu mảng bhyts
    state.bhyts.unshift(payload);
  }
};
