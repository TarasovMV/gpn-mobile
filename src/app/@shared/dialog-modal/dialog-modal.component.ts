import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-dialog-modal',
    templateUrl: './dialog-modal.component.html',
    styleUrls: ['./dialog-modal.component.scss'],
})
export class DialogModalComponent implements OnInit {
    @Input() message: string;

    constructor(public modalController: ModalController) {}

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    ngOnInit() {}
}
