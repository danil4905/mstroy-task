<script setup lang="ts">
import TheGrid from '@/components/TheGrid.vue'
const mock = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '2', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '2', label: 'Айтем 4' },
  { id: 5, parent: '2', label: 'Айтем 5' },
  { id: 6, parent: '2', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]
</script>

<template>
  <main>
    <h1>
      MStroy test
    </h1>
    <TheGrid :items="mock" />
  </main>
</template>
