import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from "./router"

import "element-plus/dist/index.css"

// 初始化 ApolloClients
import { HttpLink, split } from "@apollo/client/core"
import { createClient } from "graphql-ws"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions" 
import { getMainDefinition } from "@apollo/client/utilities"
import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core';
import { provideApolloClients } from '@vue/apollo-composable';

const cache = new InMemoryCache();
const superClient = new ApolloClient({
  cache,
  // uri: 'https://rickandmortyapi.com/graphql',
  uri: "http://159.75.243.79:4001",
})

const casClient = new ApolloClient({
  cache,
  uri: "http://159.75.243.79:8080/graphql",
})

// Create an http link:
const httpLink = new HttpLink({
  uri: "http://159.75.243.79:8082/graphql"
})

// Create a WebSocket link:
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://159.75.243.79:8082/graphql",
    // lazy: false,
    on: {
      connecting: ()=> {
        console.log("connecting")
      },
      opened: () => {
        console.log("opened")
      },
      ping: (received, payload) => {
        console.log(received)
        console.log(payload)
      },
      connected: () => {
        console.log("connected")
      },
      error: (event) => {
        console.log(event)
        console.log("error")
      }
    }
  })
)

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const avalonLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)
const avalonClient = new ApolloClient({
  cache: cache,
  link: avalonLink,
})

provideApolloClients({
  // useSubscription 改不了 clientID，暂时解决方法
  default: avalonClient,
  super: superClient,
  cas: casClient,
  avalon: avalonClient,
})

// 启动
createApp(App).use(router).mount('#app')
