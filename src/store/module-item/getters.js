export function items(state) {
  return state.items;
}

export const itemBy = (state) => (searchText) => {
  if (!searchText) return state.items;
  return [
    ...state.items.filter((item) =>
      (
        item.ttNumber +
        item.senderName +
        item.senderPhone
      )
        .toLowerCase()
        .includes(searchText.toLowerCase())
    ),
  ];
};
