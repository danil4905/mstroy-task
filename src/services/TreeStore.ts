import type { RowData } from '@/interfaces/RowData'

export class TreeStore {
  private items: RowData[]
  private readyItems

  constructor(items: RowData[]) {
    this.items = items
    this.readyItems = items.map(el => ({...el, type: el.parent? '' : ''}))
  }

  getAll(): RowData[] {
    return this.items
  }

  getItem(id: string | number): RowData | undefined {
    return this.items.find((item) => item.id === id)
  }

  getChildren(id: string | number | null): RowData[] {
    return this.items.filter((item) => item.parent === id)
  }

  getAllChildren(id: string | number | null): RowData[] {
    const result: RowData[] = []
    const stack: (string | number | null)[] = [id]

    while (stack.length) {
      const parentId = stack.pop()
      const children = this.getChildren(parentId!)
      result.push(...children)
      stack.push(...children.map((child) => child.id))
    }

    return result
  }

  getAllParents(id: string | number): RowData[] {
    const result: RowData[] = []
    let current = this.getItem(id)

    while (current && current.parent !== null) {
      current = this.getItem(current.parent)
      if (current) result.push(current)
    }

    return result.reverse()
  }

  addItem(item: RowData): void {
    this.items.push(item)
  }

  removeItem(id: string | number): void {
    const allChildren = this.getAllChildren(id)
    this.items = this.items.filter(
      (item) => item.id !== id && !allChildren.some((child) => child.id === item.id),
    )
  }
}
