/**
 * @fileoverview Defines the structure of board columns used in the Kanban view.
 * Each column represents a specific task status and contains an array of tasks.
 */

import { Task } from './task';

/**
 * Represents the four columns of the Kanban board.
 * Each column holds tasks filtered by their current status.
 */
export interface BoardColumns {
  /** Tasks that are not yet started. */
  todo: Task[];

  /** Tasks currently in progress. */
  inprogress: Task[];

  /** Tasks awaiting feedback or review. */
  awaitfeedback: Task[];

  /** Tasks that are fully completed. */
  done: Task[];
}
