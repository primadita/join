/**
 * @fileoverview Defines the structure of board columns used in the Kanban view.
 * Each column represents a specific task status and contains an array of tasks.
 */

import { Task } from './task';

/**
 * Represents the four columns of the Kanban board.
 * Each column holds tasks filtered by their current status, providing
 * a visual representation of the workflow progress.
 *
 * This interface is used to structure data flowing from the TaskService
 * to the board component for rendering the Kanban layout.
 *
 * @interface BoardColumns
 */
export interface BoardColumns {
  /**
   * Array of tasks that are not yet started.
   * These tasks appear in the first Kanban column.
   * @type {Task[]}
   */
  todo: Task[];

  /**
   * Array of tasks currently in progress.
   * These are actively being worked on by assigned team members.
   * @type {Task[]}
   */
  inprogress: Task[];

  /**
   * Array of tasks awaiting feedback or review.
   * Tasks in this column are complete but waiting for stakeholder approval or feedback.
   * @type {Task[]}
   */
  awaitfeedback: Task[];

  /**
   * Array of tasks that are fully completed.
   * These tasks should not require further work unless reopened.
   * @type {Task[]}
   */
  done: Task[];
}
