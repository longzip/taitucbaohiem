export const setBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const getAllBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const removeBhyt = (state, payload) => {
  const index = state.bhyts.findIndex(key => key.maSoBhxh === payload);
  state.bhyts.splice(index,1)
};

export const updateBhyt = (state, payload) => {
  let found = state.bhyts.find(
    (x) => x.maSoBhxh === payload.maSoBhxh || x.maSoBHXH === payload.maSoBhxh
  );
  if (found) Object.assign(found, payload);
  else state.bhyts.push(payload);
};
