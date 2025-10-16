import { Timestamp } from '@angular/fire/firestore';

export interface Subtask {
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: 'urgent' | 'medium' | 'low' | null; // enums verwenden
  assignedTo: any[];
  category: 'User Story' | 'Technical Task';
  subtasks: Subtask[];
  status: 'to do' | 'in progress' | 'await feedback' | 'done'; // enums verwenden
}
