import {TreeStore} from "../src/services/TreeStore";
import { describe, expect, beforeEach, test, ex } from 'vitest'
describe('TreeStore', () => {
  let store: TreeStore;

  beforeEach(() => {
    store = new TreeStore([
      { id: 1, parent: null, label: 'Айтем 1' },
      { id: '2', parent: 1, label: 'Айтем 2' },
      { id: 3, parent: 1, label: 'Айтем 3' },
      { id: 4, parent: '2', label: 'Айтем 4' },
      { id: 5, parent: '2', label: 'Айтем 5' },
      { id: 6, parent: '2', label: 'Айтем 6' },
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
    ]);
  });

  test('getAll() should return all items', () => {
    const allItems = store.getAll();
    expect(allItems.length).toBe(8);
  });

  test('getItem() should return the correct item by id', () => {
    const item = store.getItem(1);
    expect(item).toEqual({ id: 1, parent: null, label: 'Айтем 1' });
  });

  test('getChildren() should return direct children of the given item', () => {
    const children = store.getChildren(1);
    expect(children).toEqual([
      { id: '2', parent: 1, label: 'Айтем 2' },
      { id: 3, parent: 1, label: 'Айтем 3' },
    ]);
  });

  test('getAllChildren() should return all descendants of the given item', () => {
    const allChildren = store.getAllChildren(1);
    expect(allChildren).toEqual([
      { id: '2', parent: 1, label: 'Айтем 2' },
      { id: 4, parent: '2', label: 'Айтем 4' },
      { id: 7, parent: 4, label: 'Айтем 7' },
      { id: 8, parent: 4, label: 'Айтем 8' },
      { id: 5, parent: '2', label: 'Айтем 5' },
      { id: 6, parent: '2', label: 'Айтем 6' },
      { id: 3, parent: 1, label: 'Айтем 3' },
    ]);
  });

  test('getAllParents() should return the path to the root for the given item', () => {
    const allParents = store.getAllParents(7);
    expect(allParents).toEqual([
      { id: 4, parent: '2', label: 'Айтем 4' },
      { id: '2', parent: 1, label: 'Айтем 2' },
      { id: 1, parent: null, label: 'Айтем 1' },
    ]);
  });

  test('addItem() should add a new item to the store', () => {
    store.addItem({ id: 9, parent: 1, label: 'Новый Айтем' });
    const item = store.getItem(9);
    expect(item).toEqual({ id: 9, parent: 1, label: 'Новый Айтем' });
    expect(store.getChildren(1)).toContainEqual({ id: 9, parent: 1, label: 'Новый Айтем' });
  });

  test('removeItem() should remove the item and all its descendants', () => {
    store.removeItem('2');
    expect(store.getItem('2')).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getItem(7)).toBeUndefined();
    expect(store.getItem(8)).toBeUndefined();
  });

  test('undo() should undo the last action', () => {
    store.addItem({ id: 9, parent: 1, label: 'Новый Айтем' });
    expect(store.getItem(9)).toBeDefined();
    store.undo();
    expect(store.getItem(9)).toBeUndefined();
  });

  test('redo() should redo the last undone action', () => {
    store.addItem({ id: 9, parent: 1, label: 'Новый Айтем' });
    store.undo();
    expect(store.getItem(9)).toBeUndefined();
    store.redo();
    expect(store.getItem(9)).toBeDefined();
  });

  test('cannot redo if there is no undone action', () => {
    store.addItem({ id: 9, parent: 1, label: 'Новый Айтем' });
    store.redo();
    expect(store.getItem(9)).toBeDefined();
  });

  test('cannot undo if there is no previous action', () => {
    store.undo();
    expect(store.getAll().length).toBe(8);
  });
});
