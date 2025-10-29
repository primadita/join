/**
 * @fileoverview DatePickerComponent provides a reusable date picker field
 * built with Angular Material components. It allows users to select a due date
 * and emits the selected value to the parent component.
 */
import { Component, output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, NgModel } from '@angular/forms';

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
export class DatePickerComponent {
  // #region ATTRIBUTES
  /**
   * The currently selected due date.
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

  @ViewChildren(NgModel) formFields!: QueryList<NgModel>;
  // #endregion

  // #region METHODS
  /**
   * Emits the currently selected date to the parent component.
   * This method is typically called when the user confirms a date selection.
   */
  sendDateToParent() {
    this.sendDate.emit(this.dueDate);
  }

  clearDate() {
    this.dueDate = null;
    this.formFields.forEach(field => {
      field.control.markAsPristine();
      field.control.markAsUntouched();
    });
  }
  // #endregion
}
