export const setBhyts = (state, payload) => {
  state.bhyts = payload;
};
export const setIsRemove = (state, payload) => {
  state.isRemove = !state.isRemove;
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
