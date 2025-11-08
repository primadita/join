import { Component, ElementRef, HostListener, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Category } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  value = input<"Select category" | Category>()

  sendCategory = output<Category>();


  constructor(private el: ElementRef) { }

  checkDefaultValue() {
    return this.value() === "Select category";
  }

  isListOpen = signal(false)

  setValue(_value: Category) {
    this.sendCategory.emit(_value);
    this.isListOpen.set(false)
  }

  onFocus() {
    this.isListOpen.set(true);
  }

  onFocusButton() {
    if (this.isListOpen()) {
      this.isListOpen.set(false);
    } else {
      this.isListOpen.set(true);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isListOpen.set(false);
    }
  }

}
