export const getAllBhyts = (state, payload) => {
  state.bhyts = payload;
};

export const updateBhyt = (state, payload) => {
  let found = state.bhyts.find((x) => x.id === payload.id);
  found.completed = payload.completed;
  found.disabled = payload.disabled;
  // state.bhyts = payload;
};
