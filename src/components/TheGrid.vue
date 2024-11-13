<script lang="ts">
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { defineComponent, ref, computed, reactive } from 'vue'
import type { PropType } from 'vue'
import type { RowData } from '@/interfaces/RowData'
import { TreeStore } from '@/services/TreeStore'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-enterprise'
import NameCellRenderer from './NameCellRenderer.js'

export default defineComponent({
  name: 'TheGrid',
  components: { AgGridVue, NameCellRenderer },
  props: {
    items: {
      type: Array as PropType<RowData[]>,
      required: true,
    },
  },
  setup(props) {
    const store = reactive(new TreeStore(props.items))
    const isEditMode = ref<boolean>(false)
    const rowData = ref<RowData[]>(store.getAll())
    const changeEditMode = (value: boolean) => {
      isEditMode.value = value
    }
    const getDataPath = (data: any) => {
      return store
        .getAllParents(data.id)
        .map((parent) => parent.label)
        .concat(data.label)
    }
    const canUndo = computed(() => store.currentStep > 0)
    const canRedo = computed(() => store.currentStep < store.history.length - 1)
    const undo = () => {
      store.undo()
      rowData.value = store.getAll()
    }

    const redo = () => {
      store.redo()
      rowData.value = store.getAll()
    }
    const columnDefs = reactive([
      { headerName: '№ п/п', field: 'id', width: 110, cellDataType: 'text' },
      {
        headerName: 'Категория',
        field: 'category',
        width: 300,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true, // turn off the row count
        },
      },
      {
        headerName: 'Наименование',
        field: 'label',
        width: 390,
        editable: isEditMode,
        cellRenderer: 'NameCellRenderer',
      },
    ])
    const onCellClicked = (event: any) => {
      if (isEditMode.value) {
        if (event.eventPath[0].className.includes('btn-delete')) {
          store.removeItem(event.data.id)
          rowData.value = store.getAll()
        } else if (event.eventPath[0].className.includes('btn-add')) {
          const newItem = {
            id: Date.now(),
            parent: event.data.id,
            label: 'Новый элемент ' + store.currentStep + 1,
            category: 'Элемент',
          }
          store.addItem(newItem)
          rowData.value = store.getAll()
        }
      }
    }
    return {
      isEditMode,
      changeEditMode,
      rowData,
      getDataPath,
      columnDefs,
      history,
      redo,
      undo,
      canUndo,
      canRedo,
      onCellClicked,
    }
  },
})
</script>

<template>
  <div>
    <div class="control">
      <div>
        Режим:
        <button class="control-btn" @click="changeEditMode(!isEditMode)">
          {{ isEditMode ? 'редактирование' : ' просмотр' }}
        </button>
      </div>
      <div>
        <button v-if="isEditMode" :disabled="!canUndo" style="margin-right: 6px" @click="undo">
          Назад
        </button>
        <button v-if="isEditMode" :disabled="!canRedo" @click="redo">Вперед</button>
      </div>
    </div>
    <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      treeData
      :getDataPath="getDataPath"
      :groupDefaultExpanded="isEditMode ? -1 : 0"
      :autoGroupColumnDef="{ headerName: 'Категория', field: 'category' }"
      pagination
      groupDisplayType="custom"
      @cellClicked="onCellClicked"
      style="height: 600px; width: 800px"
    />
  </div>
</template>
<style scoped>
.control {
  margin: 20px 0;
  color: cornflowerblue;
  display: flex;
  column-gap: 10px;
}
.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: cornflowerblue;
}
.control-btn:hover {
  opacity: 80%;
}
</style>
