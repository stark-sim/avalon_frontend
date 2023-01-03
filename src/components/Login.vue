<script setup>
import { ref } from 'vue'

import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

const LOGIN_QUERY = gql`
  query login($req: loginReq!) {
    login(req: $req) {
      id
      name
      phone
      createdAt
    }
  }
`
const { result, loading, error } = useQuery(LOGIN_QUERY, {
  "req": {
    "phone": "18925537107"
  }
});

let phone = ref("")
</script>

<template>
  <h1>"登录"</h1>
  <p>{{ result }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>