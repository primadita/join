import { Component, ElementRef, HostListener, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-category',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  value:string = "Select Category"

  sendCategory = output<string>();
  

  constructor(private el: ElementRef) { }



  isListOpen = signal(false)

  setValue(_value: string){
    this.sendCategory.emit(_value);
    this.isListOpen.set(false)
  }

  onFocus() {
    this.isListOpen.set(true);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isListOpen.set(false);
    }
  }

}
