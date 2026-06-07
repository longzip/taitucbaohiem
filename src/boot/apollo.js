import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
  Observable
} from "@apollo/client/core";
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { provideApolloClient } from "@vue/apollo-composable";
import { boot } from "quasar/wrappers";

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu",
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // Check for multiple token expiration error formats
      if (
        err.extensions.code === 'jwt_auth_expired_token' || 
        err.extensions.code === 'jwt_auth_invalid_token' ||
        (err.extensions.debugMessage && err.extensions.debugMessage.includes('Expired token'))
        ) {

        return new Observable(observer => {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            localStorage.removeItem('authToken');
            window.location.href = '/auth';
            observer.error(err);
            return;
          }

          // Use fetch for the refresh token mutation to avoid an infinite loop
          fetch("https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation RefreshToken($refreshToken: String!) {
                  refreshToken(input: { refreshToken: $refreshToken }) {
                    authToken
                  }
                }
              `,
              variables: {
                refreshToken: refreshToken
              }
            })
          })
          .then(res => res.json())
          .then(result => {
            if (result.errors) {
              throw new Error(result.errors[0].message);
            }
            const newAuthToken = result.data.refreshToken.authToken;
            localStorage.setItem('authToken', newAuthToken);

            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newAuthToken}`,
              },
            });

            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(error => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth';
            observer.error(error);
          });
        });
      }
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Middleware for authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
});

export default boot(({ app }) => {
  provideApolloClient(apolloClient);
});

export { apolloClient };
