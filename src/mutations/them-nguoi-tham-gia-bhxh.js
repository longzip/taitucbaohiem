import gql from "graphql-tag";

export const THEM_NGUOI_THAM_GIA_BHXH = gql`
  mutation themNguoiThamGiaBhxh($input: ThemNguoiThamGiaBhxhInput!) {
    themNguoiThamGiaBhxh(input: $input) {
      success
      message
    }
  }
`;
