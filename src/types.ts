export interface Todo {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  isDefault?: boolean;
}

export type FilterType = 'all' | 'todo' | 'completed';
