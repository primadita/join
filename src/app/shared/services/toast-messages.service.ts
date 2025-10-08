import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Messages } from '../interfaces/messages';

/**
 * Service to show toast messages (success/error) across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {
  // #region ATTRIBUTES
  /**
   * Subject to emit toast messages.
   */
  private toastMessageSubject = new Subject<Messages>();
  /**
   * Observable to subscribe for toast status changes.
   */
  toastStatus = this.toastMessageSubject.asObservable();
  // #endregion

  constructor() { }

  // #region METHODS
  /**
   * Shows a toast message.
   * @param {string} text - The message text.
   * @param {'success'|'error'} type - The type of message.
   */
  show(text: string, type: 'success'|'error'){
    this.toastMessageSubject.next({text, type});
  }
  // #endregion
}
