import gql from "graphql-tag";

export const NGUOI_THAM_GIA_BHXH_QUERY = gql`
  query NguoiThamGiaBhxhQuery($searchKeyword: String) {
    danhSachBhxh(searchKeyword: $searchKeyword) {
      id
      hoTen
      maSoBhxh
      ngaySinh
      sdt
      diaChi
      soThangDong
      soTien
      trangThai
    }
  }
`;
