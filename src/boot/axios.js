import { boot } from "quasar/wrappers";
import axios from "axios";
import fetch from "node-fetch";
// import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// export const api = axios.create({ baseURL: "https://192.168.1.7:2024" });
export const apiKHL = axios.create({
  baseURL: "https://api-portalkhl.vnpost.vn",
});
export const apiStore = axios.create({
  baseURL: "https://store.hotham.vn/wordpress",
});

export const api = axios.create({
  baseURL: "https://app.hotham.vn",
  headers: {
    Authorization: `Bearer 2|N04KZuJ0sVeHX3puFzxXW9yEOWWvffrQh7El9e95`,
  },
});
//
export const apiServices = axios.create({
  baseURL: "https://ssm-api.vnpost.vn",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("setIsLogin")}`,
  },
});
//

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  /**
   * If session data exist in local storage, set value as session header.
   */
  // const session = ( process.browser ) ?  localStorage.getItem( "woo-session" ) : null;
  const session = localStorage.getItem("woo-session");

  if (session) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        "woocommerce-session": `Session ${session}`,
      },
    }));
  }

  return forward(operation);
});

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // if ( !process.browser ) {
    // 	return response;
    // }

    /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    const session = headers.get("woocommerce-session");

    if (session) {
      // Remove session data if session destroyed.
      if ("false" === session) {
        localStorage.removeItem("woo-session");

        // Update session new data if changed.
      } else if (localStorage.getItem("woo-session") !== session) {
        localStorage.setItem("woo-session", headers.get("woocommerce-session"));
      }
    }

    return response;
  });
});

export const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [], // no types provided
    },
  },
});

const pw = "rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu";

// Apollo GraphQL client.
export const client = new ApolloClient({
  link: middleware.concat(
    afterware.concat(
      createHttpLink({
        uri: "https://store.hotham.vn/wordpress/" + pw,
        fetch: fetch,
      })
    )
  ),
  cache: new InMemoryCache({ fragmentMatcher }),
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});
