export const setBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const getAllBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const updateBhyt = (state, payload) => {
  let found = state.bhyts.find(
    (x) => x.maSoBhxh === payload.maSoBhxh || x.maSoBHXH === payload.maSoBhxh
  );
  if (found) Object.assign(found, payload);
  else state.bhyts.push(payload);
};
