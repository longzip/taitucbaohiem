import gql from "graphql-tag";

export const THEM_LICH_SU_DONG = gql`
  mutation themDongBhxh($input: ThemDongBhxhInput!) {
    themDongBhxh(input: $input) {
      success
      message
    }
  }
`;
