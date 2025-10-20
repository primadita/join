import { Contact } from './contact';

//_______________________COMPLETED TASK INTERFACE___________________
export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: Priority | null;
  assignedTo: Array<Contact>;
  category: Category;
  subtasks: Subtask[];
  /*
    enums sind nicht mehr notwendig
    - mit type Status = Task['status'] in board-component hängt alles direkt am Interface
    - Ändert sich das interface, zieht der Typ automatisch mit
  */
  status: Status;
}

export interface Subtask {
  title: string;
  done: boolean;
}

//____________________________STATUS_________________________________
export const TASK_STATUS = {
  TO_DO: 'to do',
  IN_PROGRESS: 'in progress',
  AWAIT_FEEDBACK: 'await feedback',
  DONE: 'done',
} as const;

/*
  typeof heißt: holt den Typ einer Variablen oder eines Objekts
  keyof heißt: gib mir alle Schlüssel eines Typs - "TO_DO" | "IN_PROGRESS" | "AWAIT_FEEDBACK" | "DONE"
*/
export type Status = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

// dieser wert kann nun beim erstellen eines neuen tasks verwendet werden
// niemand kann dadurch versehentlich etwas anderes eintragen
export const DEFAULT_STATUS: Status = TASK_STATUS.TO_DO;

//____________________________PRIORITY_________________________________

// diesen wert genauso beim erstellen verwenden und nicht selbst nochmal neu schreiben
// dadurch bleibt alles gekapselt und wir brauchen bei Anderungen nur hier etwas machen
export const TASK_PRIORITY = {
  URGENT: 'urgent',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type Priority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

//__________________________ CATEGORY _________________________________
export const TASK_CATEGORY = {
  USER_STORY: 'User Story',
  TECHNICAL_TASK: 'Technical Task',
} as const;

export type Category = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];
