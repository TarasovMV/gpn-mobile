import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
    @Input() options;
    @Input() selectedOption;

    constructor(public popoverController: PopoverController) {}

    ngOnInit() {}

    emitValue(event): Promise<boolean> {
        return this.popoverController.dismiss(event);
    }
}
