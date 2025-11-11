/**
 * @fileoverview DatePickerComponent provides a reusable date picker field
 * built with Angular Material components. It allows users to select a due date
 * and emits the selected value to the parent component.
 */
import { Component, Input, OnChanges, output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, NgModel } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

/**
 * A reusable, standalone component for selecting and emitting dates.
 * Uses Angular Material's Datepicker with native date handling.
 */
@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MatNativeDateModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent implements OnChanges {
  // #region ATTRIBUTES
  /**
   * The currently selected due date. Initialized from selectedDate input.
   * @type {Date | null}
   */
  dueDate: Date | null = null;

  /**
   * The current date at the time of component creation.
   * Useful for comparing or limiting selectable dates.
   * @type {Date}
   */
  actualDate = new Date();

  /**
   * Output event emitter that notifies the parent component
   * when a date is selected or cleared.
   * @type {EventEmitter<Date | null>}
   */
  sendDate = output<Date | null>();

  /**
   * Input that allows parent to initialize or update the selected date.
   * Accepts Date, Timestamp (from Firestore), or null.
   */
  @Input() selectedDate: Date | Timestamp | null = null;

  /**
   * QueryList of form field references used for resetting/marking touched state.
   */
  @ViewChildren(NgModel) formFields!: QueryList<NgModel>;
  // #endregion

  // #region METHODS
  /**
   * Emits the currently selected date to the parent component.
   * This method is typically called when the user confirms a date selection.
   *
   * @returns {void}
   */
  sendDateToParent(): void {
    this.sendDate.emit(this.dueDate);
  }

  /**
   * Clears the selected date and resets form field states to pristine/untouched.
   *
   * @returns {void}
   */
  clearDate(): void {
    this.dueDate = null;
    this.formFields.forEach(field => {
      field.control.markAsPristine();
      field.control.markAsUntouched();
    });
  }

  /**
   * Marks all form fields as touched (used for validation display).
   *
   * @returns {void}
   */
  markDateAsTouched(): void {
    this.formFields.forEach(field => {
      field.control.markAsTouched();
    });
  }

  /**
   * Detects changes to the selectedDate input and updates dueDate accordingly.
   * Handles conversion from Firestore Timestamp to JavaScript Date.
   *
   * @param {SimpleChanges} changes - Angular change detection object
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      const value = changes['selectedDate'].currentValue;
      if (value instanceof Timestamp) {
        this.dueDate = value.toDate();
      } else if (value instanceof Date) {
        this.dueDate = value;
      } else {
        this.dueDate = null;
      }
    }
  }
  // #endregion
}
