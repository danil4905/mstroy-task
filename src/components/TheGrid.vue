<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { RowData } from '@/interfaces/RowData'
export default defineComponent({
  name: 'TheGrid',
  props: {
    items: {
      type: Array as PropType<RowData[]>,
      required: true,
    },
  },
})
</script>

<template>
  <div>Hello!</div>
</template>
