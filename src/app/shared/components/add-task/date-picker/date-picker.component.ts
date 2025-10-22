import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  providers: [
    provideNativeDateAdapter(),

  ],
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

  dueDate: Date | null = null;

  actualDate = new Date();

  sendDate = output<Date | null>();

  sendDateToParent(){
    this.sendDate.emit(this.dueDate);
  }




}
