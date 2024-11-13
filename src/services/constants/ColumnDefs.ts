export default (mode: boolean = false, render: any) => [
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
  { headerName: 'Наименование', field: 'label', editable: mode, cellRenderer: render },
]
