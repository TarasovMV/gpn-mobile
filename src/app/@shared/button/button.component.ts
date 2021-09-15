import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
    @Input() public isActive: boolean = true;
    @Input() public disabled: boolean = false;
    @Input() public icon: string = null;
    @Input() public size: 'normal' | 'small' = 'normal';

    constructor() {}

    ngOnInit() {}
}
