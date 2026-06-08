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

export const THEM_LICH_SU_DONG = gql`
  mutation themDongBhxh($input: ThemDongBhxhInput!) {
    themDongBhxh(input: $input) {
      success
      message
    }
  }
`;

export const THEM_NGUOI_THAM_GIA_BHXH = gql`
  mutation themNguoiThamGiaBhxh($input: ThemNguoiThamGiaBhxhInput!) {
    themNguoiThamGiaBhxh(input: $input) {
      success
      message
    }
  }
`;
