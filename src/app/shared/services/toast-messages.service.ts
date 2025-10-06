import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Messages } from '../interfaces/messages';

@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {
  private toastMessageSubject = new Subject<Messages>();
  toastStatus = this.toastMessageSubject.asObservable();

  constructor() { }

  show(text: string, type: 'success'|'error'){
    this.toastMessageSubject.next({text, type});
  }
}
