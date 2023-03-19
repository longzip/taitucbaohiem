import gql from 'graphql-tag'

const LOGIN_USER = gql`
mutation($input: LoginInput!) {
  login( input: $input ) {
    authToken
    user {
      id
      name
    }
  }
}
`;

export default LOGIN_USER;
