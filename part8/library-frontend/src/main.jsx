import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)