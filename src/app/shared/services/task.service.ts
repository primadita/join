import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { Task } from '../interfaces/task';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/* Ein Service ist eine Hilfsklasse, die Dinge erledigt, die mehrere Komponenten brauchen
     z.B. Daten holen, speichern usw.
  
  */
export class TaskService {
  /*
    Firestore ist eine Klasse, die von AngularFire kommt.
    Angular erzeugt ein Firestore-Objekt / Instanz und speichert es in fs.
    Das nennt man Dependency Injection
    Durch inject kann man nun fs außerhalb des constructor benutzen
    protected verhindert Zugriff von außen
  */
  protected fs: Firestore = inject(Firestore);

  /*
    Dies erstellt einen Verweis (Reference) auf die Firestore-Sammlung
    Durch private kann keine komponente direkt auf Collection zugreifen
    sie können nur fertige Methoden verwenden die auch public sind
  */
  private tasksCol = collection(this.fs, 'tasks') as CollectionReference<Task>;

  /*
    collectionData(...) gibt ein Observable - aktualisiert sich automatisch
    idField - damit man weiß, welches Dokument man aktualisieren oder löschen möchte
    readonly - tasks$ wird niemals überschrieben sondern nur nutzen
  */
  readonly tasks$: Observable<Task[]> = collectionData(this.tasksCol, {
    idField: 'id',
  });

  /*
    ################## CRUD-OPERATIONEN ####################
    CRUD: Create, Read, Update, Delete
  */

  /**
   * Nimmt das Task interface aber lässt das Feld "id" weg
   * Denn wenn ein neues Dokument angelegt wird, gibt es dies ID noch nicht
   * Firestore vergibt diese Automatisch
   *
   * @return promise - DocumentReference-Object
   */
  addTask(data: Omit<Task, 'id'>) {
    return addDoc(this.tasksCol, data);
  }

  /**
   * Destrukturierung:
   * id wird gebraucht um das Dokument zu finden
   * rest enthält alle Felder, die gespeichert werden sollen
   * doc(...) erzeugt eine Referenz auf genau dieses Dokument in Firestore
   * updateDoc(...) schickt die neuen Daten (rest) an Firestore
   * @param task
   * @returns promise<void>
   */
  updateTask(task: Task) {
    const { id, ...rest } = task;
    return updateDoc(doc(this.tasksCol, id), rest);
  }

  /**
   * Löscht das Dokument mit dieser ID aus der Task-Colletion
   * doc(...) ist wieder eine Reference auf diese Dokument in Firestore
   * deleteDoc(...) löscht dieses Dokument aus der Datenbank
   * @param id
   * @returns promise<void> - kein Ergebnis, nur das Signal "fertig"
   */
  deleteTask(id: string) {
    return deleteDoc(doc(this.tasksCol, id));
  }
}
