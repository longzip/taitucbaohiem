import gql from 'graphql-tag'

const EMPTY_CART_MUTATION = gql`
mutation EMPTY_CART_MUTATION( $input: EmptyCartInput! ) {
    emptyCart(input: $input) {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              type
              featuredImage {
                node {
                  id
                  sourceUrl
                }
              }
            }
          }
          variation {
            node {
              id
              databaseId
              name
              description
              type
              onSale
              price
              regularPrice
              salePrice
              featuredImage {
                node {
                  id
                  sourceUrl
                }
              }
              attributes {
                nodes {
                  id
                  name
                  value
                }
              }
            }
          }
          quantity
          total
          subtotal
          subtotalTax
        }
      }
      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
  }
}
`;

export default EMPTY_CART_MUTATION;