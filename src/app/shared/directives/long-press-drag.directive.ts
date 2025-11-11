import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

/**
 * @fileoverview
 * LongPressDrag directive enables long-press-to-drag functionality on touch devices.
 * Combines touch event detection with Angular CDK drag-drop to provide intuitive
 * drag-and-drop on mobile and touch interfaces while preventing accidental drags
 * during scrolling or touch interactions.
 */

@Directive({
  selector: '[appLongPressDrag]',
  standalone: true
})
/**
 * Directive that enables dragging on touch devices after a long-press delay.
 * Prevents unintended drag triggers during scrolling by requiring the user to
 * press and hold before drag is activated. Automatically enables drag when the
 * long-press duration is reached and disables it on touch end or move.
 * Works in conjunction with Angular CDK's CdkDrag for full drag-drop functionality.
 *
 * @example
 * // Enable long-press drag on a card
 * <div appLongPressDrag cdkDrag>Drag me</div>
 * 
 * @example
 * // Custom long-press delay
 * <div appLongPressDrag [longPressDelay]="500" cdkDrag>Drag me</div>
 */
export class LongPressDragDirective {
  /**
   * Delay in milliseconds before drag is activated on long-press.
   * Default is 200ms to distinguish between scrolling and drag intentions.
   * @type {number}
   * @default 200
   */
  @Input() longPressDelay = 200;

  /**
   * Timer reference for the long-press detection. Used to cancel the timer
   * if the user releases or moves the touch before delay completes.
   * @type {any}
   * @private
   */
  private pressTimer: any;

  /**
   * Flag to track if the current interaction is a touch event.
   * Used to apply touch-specific behavior.
   * @type {boolean}
   * @private
   */
  private isTouch = false;

  /**
   * Creates an instance of LongPressDragDirective.
   * @param {CdkDrag} drag - The CDK drag instance to control drag state
   * @param {ElementRef} el - Reference to the DOM element this directive is attached to
   * @param {NgZone} zone - Angular NgZone to run drag state changes inside Angular zone
   */
  constructor(private drag:CdkDrag, private el:ElementRef, private zone: NgZone) { }
  
  /**
   * Handles touch start event. Initiates a timer that enables dragging after longPressDelay.
   * Once the delay passes, the element becomes draggable and the 'drag-active' CSS class is applied.
   *
   * @param {TouchEvent} event - The touch event triggered
   * @returns {void}
   * @HostListener touchstart Listens for touch start events on the element
   */
  @HostListener('touchstart',['$event'])
    onTouchStart(event: TouchEvent){
        this.isTouch = true;
        this.pressTimer = setTimeout(() => { //Startet die Stoppuhr. Wenn die Zeit 200ms vorbei ist, passiert der Code im Inneren.
            this.zone.run(() => {
                this.drag.disabled = false;  //die Karte wird jetzt greifbar (ziehen darf starten)
                this.el.nativeElement.classList.add('drag-active');
            });
        }, this.longPressDelay);
    }

    /**
     * Handles touch end and touch move events. Cancels the long-press timer and disables dragging.
     * This prevents accidental drags when the user taps, scrolls, or swipes on the element.
     * Removes the 'drag-active' visual state.
     *
     * @returns {void}
     * @HostListener touchend Listens for touch end events
     * @HostListener touchmove Listens for touch move events (scrolling/swiping)
     */
    @HostListener('touchend')
    @HostListener('touchmove')
    onTouchEnd(){
        clearTimeout(this.pressTimer); //Stoppe die Stoppuhr (wenn sie noch läuft)
        this.zone.run(() => {
            this.drag.disabled= true;  //deaktivieren das Ziehen wieder und entferne den visuellen Effekt
            this.el.nativeElement.classList.remove('drag-active');
        });
    }

    /**
     * Angular lifecycle hook that runs after the view is initialized.
     * Checks if the device supports touch events and disables drag by default
     * for touch devices to require long-press activation.
     * On non-touch devices, drag is enabled immediately.
     *
     * @returns {void}
     */
    ngAfterViewInit(){
      if('ontouchstart' in window){
        this.drag.disabled = true;
      }
    }
}
