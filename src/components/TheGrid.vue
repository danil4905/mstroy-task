<script lang="ts">
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { defineComponent, ref } from 'vue'
import type {PropType} from 'vue'
import type { RowData } from '@/interfaces/RowData'
import {TreeStore} from "@/services/TreeStore";
import ColumnDefs from "@/services/constants/ColumnDefs";
import {AgGridVue} from "ag-grid-vue3";
import 'ag-grid-enterprise'

export default defineComponent({
  name: 'TheGrid',
  components: {AgGridVue},
  props: {
    items: {
      type: Array as PropType<RowData[]>,
      required: true,
    },
  },
  setup(props) {
    const store = new TreeStore(props.items)
    const isEditMode = ref<boolean>(true)
    const rowData = ref<RowData[]>(store.getAll().map(el => ({...el, category: store.getChildren(el.id)?.length ? 'Категория': 'Элемент'})))
    const changeEditMode = (value: boolean) => {
      isEditMode.value = value
    }
    const getDataPath = (data: any) => {
      return store.getAllParents(data.id).map(parent => parent.label).concat(data.label)
    }
    return {
      isEditMode,
      changeEditMode,
      rowData,
      getDataPath,
      columnDefs: ColumnDefs(isEditMode.value)
    }
  }
})
</script>

<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :treeData="true"
    :getDataPath="getDataPath"
    :groupDefaultExpanded="isEditMode ? -1 : 0"
    :autoGroupColumnDef="{ headerName: 'Категория', field: 'category' }"
    groupDisplayType="custom"
    style="width: 100%; height: 500px;" />
</template>
