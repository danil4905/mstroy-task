export interface RowData {
  id: number | string
  parent: number | string | null
  label: string,
  [key: string]: any
}
