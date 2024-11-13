export default {
  template: `
    <div class="flex-center">
  <span>{{ name }}</span>
      <div v-if="isEditable" class="flex-center">
        <button class="cell-btn btn-add flex-center">
          +
        </button>
        <button class="cell-btn btn-delete flex-center">
          +
        </button>
      </div></div>`,
  data: function () {
    return {
      name: '',
      isEditable: false,
    }
  },
  beforeMount() {
    this.name = this.params.value
    this.isEditable = this.params.colDef.editable
  },
}
