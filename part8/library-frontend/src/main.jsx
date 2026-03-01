import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('library-user-token')

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    }
  })

  return forward(operation)
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('library-user-token')
      return {
        authorization: token ? `Bearer ${token}` : null,
      }
    },
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)