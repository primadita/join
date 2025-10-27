import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

@Directive({
  selector: '[appLongPressDrag]',
  standalone: true
})
export class LongPressDragDirective {
  @Input() longPressDelay = 200; //in ms
  private pressTimer: any;
  private isTouch = false;

  constructor(private drag:CdkDrag, private el:ElementRef, private zone: NgZone) { }
  
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

    @HostListener('touchend') //man hebt den Finger hoch
    @HostListener('touchmove') //man bewegt den Finger (wischen oder scrollen)
    onTouchEnd(){
        clearTimeout(this.pressTimer); //Stoppe die Stoppuhr (wenn sie noch läuft)
        this.zone.run(() => {
            this.drag.disabled= true;  //deaktivieren das Ziehen wieder und entferne den visuellen Effekt
            this.el.nativeElement.classList.remove('drag-active');
        });
    }

    ngAfterViewInit(){
      if('ontouchstart' in window){ //Sicherheitsregel_ gibt es auf dem Gerät überhaupt touchstart, bzw. ist es ein Touch Gerät?
        this.drag.disabled = true;
      }
    }
}
