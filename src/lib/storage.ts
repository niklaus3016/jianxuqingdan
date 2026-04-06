import { Todo, Category } from '../types';

const STORAGE_KEYS = {
  TODOS: 'simple_order_todos',
  CATEGORIES: 'simple_order_categories',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', isDefault: true },
  { id: 'life', name: '生活', isDefault: true },
  { id: 'study', name: '学习', isDefault: true },
  { id: 'shopping', name: '购物', isDefault: true },
  { id: 'default', name: '默认', isDefault: true },
];

export const storage = {
  getTodos: (): Todo[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TODOS);
    return data ? JSON.parse(data) : [];
  },
  saveTodos: (todos: Todo[]) => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  },
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) return DEFAULT_CATEGORIES;
    
    try {
      const categories = JSON.parse(data) as Category[];
      // Remove duplicate categories by id
      const uniqueCategories = Array.from(new Map(categories.map((cat) => [cat.id, cat])).values()) as Category[];
      // If duplicates were found, save the unique version back to storage
      if (uniqueCategories.length !== categories.length) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(uniqueCategories));
      }
      return uniqueCategories;
    } catch (error) {
      console.error('Error parsing categories:', error);
      return DEFAULT_CATEGORIES;
    }
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  clearAll: () => {
    localStorage.clear();
  }
};
