export default (mode: boolean = false) => ([
  { headerName: '№ п/п', field: 'id', width: 90, cellDataType: "text" },
    { headerName: 'Категория', field: 'category', showRowGroup: true, cellRenderer: "agGroupCellRenderer", cellRendererParams: {
        suppressCount: true, // turn off the row count
      }},
    { headerName: 'Наименование', field: 'label', editable: mode }
  ])
