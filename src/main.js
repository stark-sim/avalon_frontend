import { createApp, provide, h } from 'vue'
import { DefaultApolloClient, ApolloClients } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import './style.css'
import App from './App.vue'

import router from './router'

const cache = new InMemoryCache()
const superClient = new ApolloClient({
    cache,
    // uri: 'https://rickandmortyapi.com/graphql',
    // uri: 'http://159.75.243.79:8080/graphql',
    uri: 'http://159.75.243.79:4001'
})
const casClient = new ApolloClient({
    cache,
    uri: 'http://159.75.243.79:8080/graphql'
})
const avalonClient = new ApolloClient({
    cache,
    uri: 'http://159.75.243.79:8082/graphql'
})

const app = createApp({
    setup() {
        provide(ApolloClients, {
            default: superClient,
            casClient: casClient,
            avalonClient: avalonClient
        })
    },
    render: () => h(App),
})

app.use(router).mount('#app')
