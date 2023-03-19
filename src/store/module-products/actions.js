import { apiStore, client } from "src/boot/axios";
import { Loading, QSpinnerIos } from "quasar";
import GET_CART_QUERY from "src/queries/get-cart";
import ADD_TO_CART from "src/mutations/add-to-cart";
import LOGIN_USER from "src/mutations/login-user";
export async function loginUser ({commit}, {username,password}) {
    Loading.show({
      spinner: QSpinnerIos,
      spinnerSize: "100px",
    });
    const {data} = await client.mutate({
      mutation: LOGIN_USER,
      variables: {
        input: {
          username,
          password
        }
      }
    });
    Loading.hide();
    commit("setAuthToken", data.login)
}

export async function getCart ({commit,state,dispatch}) {
    // if (!state.authToken) await dispatch('loginUser',{
    //     username: "buudienvhxtulap",
    //     password: "%1TDM95hFS!CM8Gw0(8Xju1B"
    // });
    
    // const data = JSON.stringify({
    //     query: ``,
    //     variables: {}
    //   });
    // const config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: '/graphql',
    //     headers: { 
    //       'Content-Type': 'application/json', 
    //       'Authorization': `Bearer ${state.authToken}`
    //     },
    //     data : data
    //   };
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      const {data} = await client.query({
        query: GET_CART_QUERY,
      });
      Loading.hide();
      commit("setCart", data)
}
export async function addToCart ({commit,state,dispatch},{productId}) {
    // if (!state.authToken) await dispatch('loginUser',{
    //     username: "buudienvhxtulap",
    //     password: "%1TDM95hFS!CM8Gw0(8Xju1B"
    // });
    
    // const data = JSON.stringify({
    //     query: `mutation ($input: AddToCartInput!) {
    //         addToCart(input: $input) {
    //           cart {
    //             contents {
    //               nodes {
    //                 key
    //                 product {
    //                   node {
    //                     id
    //                     databaseId
    //                     name
    //                     type
    //                     featuredImage {
    //                       node {
    //                         id
    //                         sourceUrl
    //                       }
    //                     }
    //                   }
    //                 }
    //                 variation {
    //                   node {
    //                     id
    //                     databaseId
    //                     name
    //                     description
    //                     type
    //                     onSale
    //                     price
    //                     regularPrice
    //                     salePrice
    //                     featuredImage {
    //                       node {
    //                         id
    //                         sourceUrl
    //                       }
    //                     }
    //                     attributes {
    //                       nodes {
    //                         id
    //                         name
    //                         value
    //                       }
    //                     }
    //                   }
    //                 }
    //                 quantity
    //                 total
    //                 subtotal
    //                 subtotalTax
    //               }
    //             }
    //             subtotal
    //             subtotalTax
    //             shippingTax
    //             shippingTotal
    //             total
    //             totalTax
    //             feeTax
    //             feeTotal
    //             discountTax
    //             discountTotal
    //           }
    //         }
    //       }`,
    //     variables: {
    //         input: {
    //           productId: parseInt(productId)
    //         }
    //       }
    //   });
    // const config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: '/graphql',
    //     headers: { 
    //       'Content-Type': 'application/json', 
    //       'Authorization': `Bearer ${state.authToken}`
    //     },
    //     data : data
    //   };
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      const {data} = await client.query({
        query: ADD_TO_CART,
        variables: {
          input: {
            productId: parseInt(productId)
          }
        }
      });
      Loading.hide();
      commit("setCart", data.data.addToCart)
}

export async function checkout ({commit,state,dispatch}) {
    // if (!state.authToken) await dispatch('loginUser',{
    //     username: "buudienvhxtulap",
    //     password: "%1TDM95hFS!CM8Gw0(8Xju1B"
    // });
    
    const data = JSON.stringify({
        query: `mutation {
          checkout(
            input: {account: {password: "%1TDM95hFS!CM8Gw0(8Xju1B", username: "buudienvhxtulap"}, customerNote: "Test thử", paymentMethod: "bacs"}
          ) {
            customer {
              id
            }
            order {
              id
            }
            redirect
            result
          }
        }`,
        variables: {}
      });
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/graphql',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${state.authToken}`
        },
        data : data
      };
      Loading.show({
        spinner: QSpinnerIos,
        spinnerSize: "100px",
      });
      const {data: respon} = await apiStore.request(config);
      Loading.hide();
      console.log(respon);
      // commit("setCart", respon.data.addToCart)
}

