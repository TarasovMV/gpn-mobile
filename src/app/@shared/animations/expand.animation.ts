import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const expandAnimation: any = trigger('expandedPanel', [
    state('initial', style({ height: 0 })),
    state('expanded', style({ height: '*' })),
    transition('initial <=> expanded', animate('0.4s')),
]);
