<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Person } from '@/application/app/api/Person'
import { useApiClient } from '@/application/app/api/ApiClient'
import { injectAuthentication } from '@/application/authentication/Authentication.provider'

const persons = ref<Person[]>()
const apiClient = useApiClient()

onMounted(async () => {
  const auth = injectAuthentication()
  persons.value = await apiClient.getPersons(await auth.getAccessToken())
})
</script>

<template>
  <h1>Persons</h1>
  <ul v-if="persons">
    <li v-for="person in persons" :key="person.id">
      {{ person.name }} {{ person.familyName }}
    </li>
  </ul>
</template>

<style scoped lang="scss"></style>
