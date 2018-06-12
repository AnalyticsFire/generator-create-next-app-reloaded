import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

const cache = new InMemoryCache();

const defaultState = {
  counter: {
    __typename: 'Counter',
    value: 0,
  },
};

const query = gql`
  query getCounter {
    counter @client {
      value
    }
  }
`;

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      increaseCounter: (_, { counter }, { cache }) => {
        const previousState = cache.readQuery({ query });

        const data = {
          ...previousState,
          counter: {
            ...previousState.counter,
            value: counter + 1,
          },
        };

        cache.writeQuery({ query, data });
        return counter;
      },
      decreaseCounter: (_, { counter }, { cache }) => {
        const previousState = cache.readQuery({ query });

        const data = {
          ...previousState,
          counter: {
            ...previousState.counter,
            value: counter > 0 ? counter - 1 : 0,
          },
        };

        cache.writeQuery({ query, data });
        return counter;
      },
    },
  },
});

const create = initialState =>
  new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([
      stateLink,
      new HttpLink({
        uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
      }),
    ]),
    cache,
  });

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
