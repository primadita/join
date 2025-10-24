/**
 * @fileoverview Provides Firestore-based CRUD (Create, Read, Update, Delete) operations for tasks.
 * This service is a single source of truth for all task data.
 * It exposes a reactive stream (`tasks$`) that automatically updates
 * when Firestore data changes.
 */
import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../interfaces/task';
import { Observable } from 'rxjs';

/**
 * Service for managing task data in Firestore.
 * Handles creation, reading, updating, and deletion of tasks.
 * The service lives for the lifetime of the application.
 */
@Injectable({
  providedIn: 'root',
})

export class TaskService {
  // #region ATTRIBUTES
 /**
   * Firestore instance injected via Angular’s dependency injection.
   * Used for creating collection references and performing database operations.
   * @protected
   */
  protected fs: Firestore = inject(Firestore);

  /**
   * Reference to the "tasks" collection in Firestore.
   * Restricted to internal use within the service.
   * @private
   */
  private tasksCol = collection(this.fs, 'tasks') as CollectionReference<Task>;

  /**
   * Reactive stream of all tasks in Firestore.
   * Automatically emits updates when Firestore data changes.
   *
   * The `idField` option ensures each task document includes its Firestore ID.
   * @readonly
   * @type {Observable<Task[]>}
   */
  readonly tasks$: Observable<Task[]> = collectionData(this.tasksCol, {
    idField: 'id',
  });

  
  //  ################## CRUD-OPERATIONEN ####################
  

  /**
   * Adds a new task to the Firestore collection.
   *
   * The `id` field is omitted because Firestore automatically generates it.
   *
   * @param {Omit<Task, 'id'>} data - Task data excluding the `id` field.
   * @returns {Promise<import('firebase/firestore').DocumentReference>} A promise resolving to the created document reference.
   */
  addTask(data: Omit<Task, 'id'>) {
    return addDoc(this.tasksCol, data);
  }

  /**
   * Updates an existing task document in Firestore.
   *
   * @param {Task} task - The task object containing the updated data.
   * The `id` field is used to locate the document.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  updateTask(task: Task) {
    const { id, ...rest } = task;
    return updateDoc(doc(this.tasksCol, id), rest);
  }

   /**
   * Deletes a task document from Firestore by its ID.
   *
   * @param {string} id - The Firestore document ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  deleteTask(id: string) {
    return deleteDoc(doc(this.tasksCol, id));
  }
}
