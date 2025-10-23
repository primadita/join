/**
 * @fileoverview Defines the Task interface and related enumerations for
 * priorities, categories, and statuses used across the Kanban application.
 */
import { Contact } from './contact';

/**
 * Represents a single task within the application.
 */
export interface Task {
  /** Unique identifier assigned by Firestore. */
  id: string;

  /** Short descriptive title of the task. */
  title: string;

  /** Detailed information about the task. */
  description: string;

  /** Due date for the task, or null if not specified. */
  date: Date | null;

  /** Task priority level (urgent, medium, or low). */
  priority: Priority | null;

  /** List of users or contacts assigned to the task. */
  assignedTo: Array<Contact>;

  /** Category of the task (e.g., User Story, Technical Task). */
  category: Category;

  /** List of subtasks associated with this task. */
  subtasks: Subtask[];
  
  /** List of subtasks associated with this task. */
  status: Status;
}

//__________________________ SUBTASK _________________________________
/**
 * Represents a smaller task that contributes to completing a parent task.
 */
export interface Subtask {
  /** Title or label of the subtask. */
  title: string;

  /** Indicates whether the subtask has been completed. */
  done: boolean;
}

//__________________________ STATUS _________________________________
/**
 * Enumeration of possible task statuses.
 * These values correspond directly to Firestore data and UI columns.
 */
export const TASK_STATUS = {
  TO_DO: 'to do',
  IN_PROGRESS: 'in progress',
  AWAIT_FEEDBACK: 'await feedback',
  DONE: 'done',
} as const;

/**
 * Type representing valid task status values.
 * @typedef {'to do' | 'in progress' | 'await feedback' | 'done'} Status
 */
export type Status = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

/** Default task status assigned when creating a new task. */
export const DEFAULT_STATUS: Status = TASK_STATUS.TO_DO;

//__________________________ PRIORITY _________________________________
/**
 * Enumeration of task priority levels.
 * Used to indicate urgency or importance of a task.
 */
export const TASK_PRIORITY = {
  URGENT: 'urgent',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

/**
 * Type representing valid task priority values.
 * @typedef {'urgent' | 'medium' | 'low'} Priority
 */
export type Priority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

//__________________________ CATEGORY _________________________________
/**
 * Enumeration of available task categories.
 * Used to classify tasks for better organization and filtering.
 */
export const TASK_CATEGORY = {
    DEFAULT: "Select Category",
  USER_STORY: 'User Story',
  TECHNICAL_TASK: 'Technical Task',
} as const;

/**
 * Type representing valid task category values.
 * @typedef {'Select Category' | 'User Story' | 'Technical Task'} Category
 */
export type Category = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];
