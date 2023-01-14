<script setup lang="ts">
// import gql from 'graphql-tag'
// import { useQuery } from '@vue/apollo-composable'
//
// const CHARACTERS_QUERY = gql`
//   query Characters {
//     characters {
//       results {
//         id
//         name
//         image
//       }
//     }
//   }
// `
// const { result, loading, error } = useQuery(CHARACTERS_QUERY);
</script>

<template>
  <!-- <div>
    <p v-if="error">Something went wrong...</p>
    <p v-if="loading">Loading...</p>
    <p v-else v-for="character in result.characters.results" :key="character.id">
      {{ character.name }}
    </p>
  </div> -->
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
