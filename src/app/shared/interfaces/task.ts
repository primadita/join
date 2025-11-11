/**
 * @fileoverview Defines the Task interface and related enumerations for
 * priorities, categories, and statuses used across the Kanban application.
 */
import { Timestamp } from '@angular/fire/firestore';
import { Contact } from './contact';

/**
 * Represents a single task within the application.
 *
 * Tasks are the core data model for the Kanban board. Each task tracks its
 * progress through different statuses (to do, in progress, await feedback, done),
 * can be assigned to multiple contacts, and may include subtasks for granular tracking.
 *
 * @interface Task
 */
export interface Task {
  /**
   * Unique identifier assigned by Firestore.
   * Used for lookups, updates, and deletions across the application.
   * @type {string}
   */
  id: string;

  /**
   * Short descriptive title of the task.
   * Displayed in task cards, summaries, and search results.
   * Should be concise but informative.
   * @type {string}
   */
  title: string;

  /**
   * Detailed information about the task.
   * Provides full context, acceptance criteria, or notes about the work required.
   * Can include markdown or plain text.
   * @type {string}
   */
  description: string;

  /**
   * Due date for the task.
   * Can be a JavaScript Date, Firestore Timestamp, or null if no deadline.
   * Used for sorting tasks by deadline and generating summary reports.
   * @type {Date | null | Timestamp}
   */
  date: Date | null | Timestamp;

  /**
   * Task priority level indicating urgency or importance.
   * One of: 'urgent', 'medium', 'low', or null (unset).
   * Used for sorting, filtering, and visual highlighting on the board.
   * @type {Priority | null}
   */
  priority: Priority | null;

  /**
   * List of contacts assigned to work on this task.
   * Multiple users can be assigned to collaborate on a single task.
   * Each element is a full Contact object.
   * @type {Array<Contact>}
   */
  assignedTo: Array<Contact>;

  /**
   * Category of the task for organizational purposes.
   * Examples: 'Select category', 'User Story', 'Technical Task'.
   * Used for filtering and organizing work.
   * @type {Category}
   */
  category: Category;

  /**
   * List of smaller, related tasks that contribute to completing this task.
   * Each subtask can be marked complete independently, allowing granular progress tracking.
   * @type {Subtask[]}
   */
  subtasks: Subtask[];

  /**
   * Current status of the task in the workflow.
   * One of: 'to do', 'in progress', 'await feedback', 'done'.
   * Determines which Kanban column the task appears in.
   * @type {Status}
   */
  status: Status;
}

//__________________________ SUBTASK _________________________________
/**
 * Represents a smaller task that contributes to completing a parent task.
 *
 * Subtasks allow users to break down work into smaller, trackable units.
 * Each subtask can be marked complete independently, providing granular progress tracking.
 *
 * @interface Subtask
 */
export interface Subtask {
  /**
   * Title or label of the subtask.
   * Brief description of the specific work item.
   * @type {string}
   */
  title: string;

  /**
   * Indicates whether the subtask has been completed.
   * When true, the subtask is marked as done and may be visually struck-through.
   * @type {boolean}
   * @default false
   */
  done: boolean;
}

//__________________________ STATUS _________________________________
/**
 * Enumeration of possible task statuses.
 * These values correspond directly to Firestore data and Kanban board UI columns.
 * 
 * Workflow typically flows: TO_DO → IN_PROGRESS → AWAIT_FEEDBACK → DONE
 * Tasks can also move backward (e.g., back to IN_PROGRESS if feedback requires changes).
 *
 * @constant
 * @type {Object}
 */
export const TASK_STATUS = {
  /** Task has not been started yet. Appears in the first Kanban column. */
  TO_DO: 'to do',
  
  /** Task is currently being worked on. */
  IN_PROGRESS: 'in progress',
  
  /** Task is awaiting feedback or review from team members. */
  AWAIT_FEEDBACK: 'await feedback',
  
  /** Task is complete and should not require further work. */
  DONE: 'done',
} as const;

/**
 * Type representing valid task status values.
 *
 * Ensures type safety when working with task statuses throughout the application.
 *
 * @typedef {('to do' | 'in progress' | 'await feedback' | 'done')} Status
 */
export type Status = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

/**
 * Default task status assigned when creating a new task.
 * New tasks always start in the 'to do' column.
 *
 * @constant
 * @type {Status}
 * @default 'to do'
 */
export const DEFAULT_STATUS: Status = TASK_STATUS.TO_DO;

//__________________________ PRIORITY _________________________________
/**
 * Enumeration of task priority levels.
 * Used to indicate urgency or importance of a task for sorting and visual highlighting.
 *
 * Priority affects:
 * - Task card appearance and styling on the Kanban board
 * - Sorting in reports and summaries
 * - Alert visibility (urgent tasks are often highlighted)
 *
 * @constant
 * @type {Object}
 */
export const TASK_PRIORITY = {
  /** Critical task requiring immediate attention. */
  URGENT: 'urgent',
  
  /** Standard priority task. */
  MEDIUM: 'medium',
  
  /** Lower priority task that can wait. */
  LOW: 'low',
} as const;

/**
 * Type representing valid task priority values.
 *
 * Ensures type safety when filtering or assigning task priorities.
 *
 * @typedef {('urgent' | 'medium' | 'low')} Priority
 */
export type Priority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

//__________________________ CATEGORY _________________________________
/**
 * Enumeration of available task categories.
 * Used to classify tasks for better organization, filtering, and workflow management.
 *
 * Categories help teams:
 * - Organize work by type (features vs. technical work)
 * - Track different workflows separately
 * - Filter and search tasks more effectively
 *
 * @constant
 * @type {Object}
 */
export const TASK_CATEGORY = {
  /** Default/unspecified category. Used when no other category applies. */
  DEFAULT: 'Select category',
  
  /** Feature request or user-facing work. */
  USER_STORY: 'User Story',
  
  /** Internal technical work (refactoring, infrastructure, etc.). */
  TECHNICAL_TASK: 'Technical Task',
} as const;

/**
 * Type representing valid task category values.
 *
 * Ensures type safety when assigning or filtering task categories.
 *
 * @typedef {(typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY]} Category
 */
export type Category = (typeof TASK_CATEGORY)[keyof typeof TASK_CATEGORY];
