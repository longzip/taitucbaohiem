import client from "../../utils";
export const getAllBhyts = async ({ commit }, payload) => {
  const { startDate, endDate = startDate, completed, name, page } = payload;

  let url = "/api/bhyts?";
  if (page) url += `page=${page}`;
  if (name) url += `&name=${name}`;
  if (startDate)
    url += `&appointments[]=${startDate}&appointments[]=${endDate}`;
  url += `&completed=${completed ? 1 : 0}`;

  const { data } = await client.get(url);

  if (data) commit("getAllBhyts", data);
};
