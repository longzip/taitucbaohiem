import gql from "graphql-tag";

export const LICH_SU_DONG_BHXH_QUERY = gql`
  query LichSuDongBhxhQuery($idNguoiThamGia: Int!) {
    lichSuDongBhxh(idNguoiThamGia: $idNguoiThamGia) {
      id
      ngayLap
      tongTien
      hinhThucTt
      ghiChuDong
      nguoiThu
    }
  }
`;
