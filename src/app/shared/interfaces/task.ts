export interface Subtask {
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'urgent' | 'medium' | 'low' | null; // enums verwenden
  assignedTo: Array<string>;
  category: 'User Story' | 'Technical Task';
  subtasks: Subtask[];
  status: 'to do' | 'in progress' | 'await feedback' | 'done'; // enums verwenden
}
