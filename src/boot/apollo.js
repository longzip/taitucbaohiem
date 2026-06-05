import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import { boot } from "quasar/wrappers";

// Tạo HTTP Link kết nối tới hotham.vn WordPress GraphQL
const httpLink = createHttpLink({
  uri: "https://hotham.vn/wordpress/rYkOy1HCCRD0JZZcrshVYaUR39QfcG15QWUC437BMM5Pk3gNLu",
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default boot(({ app }) => {
  // Cung cấp Apollo Client cho toàn bộ Vue App thông qua App Context của Quasar
  provideApolloClient(apolloClient);
});

export { apolloClient };
