import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode from 'jwt-decode'
import { App } from './App'
import { getAccessToken, setAccessToken } from './accessToken'
import './styles.css';
import { onError } from 'apollo-link-error'

// Redux 
import { Provider } from "react-redux";
import {store} from "./redux/store";

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
// })

const url = "http://localhost:3001"

const httpLink = createHttpLink({
  uri: `${url}/graphql`,
  credentials: 'include',
})


const authLink = setContext((_, { headers }) => {
  const token = getAccessToken()
  console.log(token);
  console.log(headers);
  let cookieValue = document.cookie
  console.log(`This is tht cookie ${cookieValue}`);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
}) 

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken()

    if (!token) {
      return true
    }


    try {
      const { exp }: any = jwtDecode(token)

      if (Date.now() >= exp * 1000) {
        return false
      } else {
        return true
      }
    } catch (e) {
      console.log('Error here...')
      return false
    }
  },
  fetchAccessToken: () => {
    return fetch(`${url}/refresh_token`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
    })
  },
  handleFetch: (accessToken) => {
    
    console.log(`Fetching the accessToken ${accessToken}`);
    setAccessToken(accessToken)
  },
  handleError: (err) => {
    console.warn('Your refresh token is invalid. Try to relogin')
    console.log(err)
  },
})

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})


const client = new ApolloClient({
  // For some reason Typescript doesn't agree with the tokenRefreshLink type here
  // @ts-ignore
  link: from([tokenRefreshLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myFeed: {
            merge(existing, incoming){
              return incoming
            }
          },
          myPosts: {
            merge(existing, incoming){
              return incoming
            }
          },
          myProjects :{
            merge(existing, incoming){
              return incoming
            } 
            
          }
        }
      }
      }
  }),

})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)