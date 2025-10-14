import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  firestore: Firestore = inject(Firestore);
  tasksList: Task[] = [];
  unsubTasks;

  constructor() {
    this.unsubTasks = this.subTasksList();
  }

  // cleans up Firestore subscriptions when the component destroyed
  ngonDestroy() {
    this.unsubTasks && this.unsubTasks();
  }

  // Subscribes real-time updates from the Firebase tasks collection
  // updates the local tasks list whenever changes occur
  subTasksList() {
    return onSnapshot(this.getTasksRef(), (list) => {
      this.tasksList = [];
      list.forEach((doc) => {
        this.tasksList.push(this.setTaskObject(doc.data(), doc.id));
      });
    });
  }

  // Maps Firestore tasks document to a Task object
  setTaskObject(obj: any, id: string): Task {
    return {
      id: id,
      title: obj.title,
      description: obj.description,
      date: obj.date,
      priority: obj.priority, // urgent,medium, low
      assignedTo: obj.assignedTo, // Array
      category: obj.category, // User Story | Technical Task
      subtasks: obj.subtaks.map((sub: any) => ({
        // Array with title and done
        title: sub.title,
        done: sub.done,
      })),
      status: obj.status,
    };
  }

  async updateTask(task: Task) {
    try {
      const taskRef = this.getSingleDocRef(task.id);
      await updateDoc(taskRef, this.getCleanJson(task));
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // clean JSON Object for Firestore update
  getCleanJson(task: Task) {
    return {
      title: task.title,
      description: task.description,
      date: task.date,
      priority: task.priority,
      assignedTo: task.assignedTo,
      category: task.category,
      subtasks: task.subtasks,
      status: task.subtasks,
    };
  }

  // returns collection taks reference
  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  // returns single doc task reference
  getSingleDocRef(id: string) {
    return doc(collection(this.firestore, 'tasks'), id);
  }
}
