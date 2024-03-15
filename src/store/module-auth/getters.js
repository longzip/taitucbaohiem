export const users = (state) => {
  let usersFiltered = {};
  Object.keys(state.users).forEach((key) => {
    if (key !== state.userDetails.userId) {
      usersFiltered[key] = state.users[key];
    }
  });
  return usersFiltered;
};
export const findUser = (state) => (userId) => state.users[userId];

export const isLogin = (state) => state.isLogin;

export const userDetails = (state) => state.userDetails;
