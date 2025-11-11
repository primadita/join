import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * @fileoverview
 * PatternValidator directive provides flexible form input validation with preset patterns
 * and custom regex support. Validates form controls against email, phone, name, password,
 * and other common patterns. Integrates with Angular Forms validation system.
 */

@Directive({
  selector: '[appPatternValidator]',
  standalone: true,
    providers: [{
      provide: NG_VALIDATORS,
      useExisting: PatternValidatorDirective,
      multi: true
    }]
})
/**
 * Directive that validates form input against predefined or custom patterns.
 * Implements Angular's Validator interface to provide form validation.
 * Supports preset patterns (email, phone, password, name, text) or custom regex.
 * Also applies HTML5 pattern attribute for browser-level validation feedback.
 *
 * @example
 * // Using preset pattern
 * <input appPatternValidator="emailFormat" formControl="email">
 * 
 * @example
 * // Using custom regex
 * <input [appPatternValidator]="'^[A-Z]+$'" formControl="code">
 *
 * @implements {Validator}
 * @implements {OnInit}
 */
export class PatternValidatorDirective implements Validator, OnInit{
  // #region ATTRIBUTES
  /**
   * Input pattern identifier. Can be a preset name ('emailFormat', 'phoneFormat', 'generalName',
   * 'generalText', 'password') or a custom regex pattern string.
   * @type {string}
   * @default ''
   */
  @Input('appPatternValidator') inputValue: string = '';

  /**
   * The resolved regex pattern string used for validation.
   * Set during ngOnInit by resolving preset names or using custom patterns.
   * @type {string}
   */
  patternString: string = '';

  /**
   * The compiled regular expression used to test input values.
   * Created during ngOnInit from the resolved patternString.
   * Uses Unicode flag ('u') to support international characters.
   * @type {RegExp}
   * @private
   */
  private regex!: RegExp;
  // #endregion
  
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  // #region METHODS
  /**
   * Initializes the validator by resolving the input pattern to a regex.
   * Maps preset pattern names to their regex patterns and applies the pattern
   * to the native HTML element's pattern attribute for browser-level validation.
   * Supports presets: 'generalName', 'phoneFormat', 'emailFormat', 'generalText', 'password'
   *
   * @returns {void}
   */
  ngOnInit(): void {
      const presets: Record<string, string> = {
        generalName: '^\\p{L}+(?:[\'’\\- ]\\p{L}+)*$', // \p{L}: jedes Unicode Letter Zeichen, + : mindestens ein Buchstabe, (?: optional), dann ist '´- oder Leerzeichen erlaubt-
        phoneFormat: '^\\+?[0-9](?:[0-9 ]*[0-9])?$',
        emailFormat: '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$',
        generalText: '.*\\p{L}.*',
        password: '^[a-zA-Z0-9.,_#&?!%+$*=^"\\/\\-><:{}|]{8,}$'
      };
      this.patternString = presets[this.inputValue] || this.inputValue;
      this.regex = new RegExp(this.patternString, 'u');
      this.renderer.setAttribute(this.el.nativeElement, "pattern", this.patternString);
  }

  /**
   * Validates the form control value against the configured pattern.
   * Handles different validation logic based on pattern type:
   * - For non-password patterns: simple regex test
   * - For password: checks strength requirements (lowercase, uppercase, numbers, special chars, min 8 chars)
   * Empty values are treated as valid (null).
   *
   * @param {AbstractControl} control - The form control to validate
   * @returns {ValidationErrors | null} null if valid, or error object with:
   *   - invalidPattern: true (for non-password patterns)
   *   - passwordInvalid: {lowercase, uppercase, number, special, minlength} (for password pattern)
   */
  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.regex || !control.value) return null;
    if( this.inputValue !== 'password'){
      return this.regex.test(control.value) ? null : {invalidPattern: true};
    }

    if (this.inputValue === 'password'){
      const passwordInput = control.value;
      const checkPasswordStrength = {
        lowercase: !/[a-z]/.test(passwordInput),
        uppercase: !/[A-Z]/.test(passwordInput),
        number: !/[0-9]/.test(passwordInput),
        special: !/[.,_#&?!%+$*=^"\\/\-><:{}|]/.test(passwordInput),
        minlength: passwordInput.length < 8
      }
      const hasErrors = Object.values(checkPasswordStrength).some(v => v === true);
      return hasErrors ? {passwordInvalid: checkPasswordStrength}: null;
    }
    return null;
  }
  // #endregion
}
