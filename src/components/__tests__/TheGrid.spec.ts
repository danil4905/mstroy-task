import { render, fireEvent } from '@testing-library/vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TheGrid from '@/components/TheGrid.vue';
import { TreeStore } from '@/services/TreeStore';
import type { RowData } from '@/interfaces/RowData';

vi.mock('@/services/TreeStore'); // Мок для TreeStore, если требуется

const sampleData: RowData[] = [
  { id: 1, parent: null, label: 'Айтем 1', category: 'Группа' },
  { id: 2, parent: 1, label: 'Айтем 2', category: 'Группа' },
  { id: 3, parent: 1, label: 'Айтем 3', category: 'Группа' },
  { id: 4, parent: 2, label: 'Айтем 4', category: 'Элемент' },
  { id: 5, parent: 2, label: 'Айтем 5', category: 'Элемент' },
];

describe('TheGrid.vue', () => {
  let store: TreeStore;

  beforeEach(() => {
    store = new TreeStore(sampleData);
  });

  it('renders with initial props and displays grid', async () => {
    const { getByText } = render(TheGrid, {
      props: { items: sampleData },
    });

    // Проверяем отображение начальных данных
    expect(getByText('Айтем 1')).toBeInTheDocument();
    expect(getByText('Айтем 2')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', async () => {
    const { getByText } = render(TheGrid, {
      props: { items: sampleData },
    });

    const editButton = getByText('редактирование');
    await fireEvent.click(editButton);

    // Проверяем переключение режима
    expect(editButton.textContent).toBe('просмотр');
  });

  it('disables undo/redo buttons when there is no history', async () => {
    const { getByText } = render(TheGrid, {
      props: { items: sampleData },
    });

    const undoButton = getByText('Назад');
    const redoButton = getByText('Вперед');

    // Проверяем, что кнопки отключены
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('enables undo/redo buttons after adding and removing items', async () => {
    const { getByText, getByRole, emitted } = render(TheGrid, {
      props: { items: sampleData },
    });

    const editButton = getByText('редактирование');
    await fireEvent.click(editButton);

    // Добавляем элемент
    const addButton = getByRole('button', { name: /add/i });
    await fireEvent.click(addButton);

    // Проверяем, что кнопка "Назад" стала активной
    const undoButton = getByText('Назад');
    expect(undoButton).not.toBeDisabled();
    expect(emitted()).toHaveProperty('addItem');

    // Удаляем элемент
    const deleteButton = getByRole('button', { name: /delete/i });
    await fireEvent.click(deleteButton);

    // Проверяем, что кнопка "Вперед" стала активной
    const redoButton = getByText('Вперед');
    expect(redoButton).not.toBeDisabled();
    expect(emitted()).toHaveProperty('removeItem');
  });

  it('calls TreeStore.undo and TreeStore.redo methods when undo and redo buttons are clicked', async () => {
    const { getByText } = render(TheGrid, {
      props: { items: sampleData },
    });

    const undoSpy = vi.spyOn(store, 'undo');
    const redoSpy = vi.spyOn(store, 'redo');

    // Переключаемся в режим редактирования и добавляем элемент
    const editButton = getByText('редактирование');
    await fireEvent.click(editButton);
    store.addItem({ id: 6, parent: 1, label: 'Новый элемент', category: 'Элемент' });

    const undoButton = getByText('Назад');
    await fireEvent.click(undoButton);
    expect(undoSpy).toHaveBeenCalled();

    const redoButton = getByText('Вперед');
    await fireEvent.click(redoButton);
    expect(redoSpy).toHaveBeenCalled();
  });
});
