import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)
