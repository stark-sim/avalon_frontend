import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import './style.css'
import App from './App.vue'

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
    cache,
    uri: 'https://rickandmortyapi.com/graphql',
})

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
})

app.mount('#app')
