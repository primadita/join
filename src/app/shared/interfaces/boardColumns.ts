import { Task } from './task';

export interface BoardColumns {
  todo: Task[];
  inprogress: Task[];
  awaitfeedback: Task[];
  done: Task[];
}
