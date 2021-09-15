import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
    selector: '[appRipple]',
})
export class RippleDirective {
    @Input() rippleEl: ElementRef;
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('click', ['$event']) startRipple(e: any) {
        const x = e.offsetX;
        const y = e.offsetY;

        this.el.nativeElement.insertAdjacentHTML(
            'afterbegin',
            '<div class="ripple"></div>'
        );

        this.renderer.setStyle(
            this.el.nativeElement.querySelector('.ripple'),
            'top',
            `${y}px`
        );
        this.renderer.setStyle(
            this.el.nativeElement.querySelector('.ripple'),
            'left',
            `${x}px`
        );

        this.renderer.addClass(this.el.nativeElement.querySelectorAll('.ripple')[0], 'ripple_active');
        const timeOut = setTimeout (()=> {
            const allRipples = this.el.nativeElement.querySelectorAll('.ripple_active');
            this.renderer.removeChild(this.el.nativeElement, allRipples[allRipples.length - 1]);
        }, 700);
    }
}
