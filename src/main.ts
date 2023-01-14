import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core';
import { provideApolloClients } from '@vue/apollo-composable';

import router from "./router"

import "element-plus/dist/index.css"

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

const avalonClient = new ApolloClient({
    cache,
    uri: "http://159.75.243.79:8082/graphql",
})

provideApolloClients({
    default: superClient,
    cas: casClient,
    avalon: avalonClient,
})

createApp(App).use(router).mount('#app')
