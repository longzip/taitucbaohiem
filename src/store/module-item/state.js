export default function () {
  const [nam, thang, ngay] = new Date().toISOString().slice(0, 10).split("-");
  return {
    //
    ngay,
    thang,
    nam,
    items: [],
    tokenFe: ""
  }
}
