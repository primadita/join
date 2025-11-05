import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPatternValidator]',
  standalone: true,
    providers: [{
      provide: NG_VALIDATORS,
      useExisting: PatternValidatorDirective,
      multi: true
    }]
})
export class PatternValidatorDirective implements Validator, OnInit{
  @Input('appPatternValidator') inputValue: string = '';
  patternString: string = '';

  private regex!: RegExp;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
      const presets: Record<string, string> = {
        generalName: '^\\p{L}+(?:[\'’\\- ]\\p{L}+)*$', // \p{L}: jedes Unicode Letter Zeichen, + : mindestens ein Buchstabe, (?: optional), dann ist '´- oder Leerzeichen erlaubt-
        phoneFormat: '^\\+?[0-9 ]+$',
        emailFormat: '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$',
        generalText: '.*\\p{L}.*',
        password: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,_#&%+$=^"\/\-])[a-zA-Z0-9.,_#&%+$=^"\/\-]{8,}$'
      };
      this.patternString = presets[this.inputValue] || this.inputValue;
      this.regex = new RegExp(this.patternString, 'u');
      this.renderer.setAttribute(this.el.nativeElement, "pattern", this.patternString) //HTML Attribut "pattern" für das <input> wird von regex übernommen. Bei :invalid wird genau diese überprüft.
    
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.regex || !control.value) return null; //ist das Eingabefeld leer? dann null. Null wird nicht als Fehler behandelt.
    return this.regex.test(control.value) ? null : {invalidPattern: true};
  }
}
