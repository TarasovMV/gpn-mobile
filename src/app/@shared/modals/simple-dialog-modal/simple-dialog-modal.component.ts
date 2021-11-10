import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';

@Component({
    selector: 'app-simple-dialog-modal',
    templateUrl: './simple-dialog-modal.component.html',
    styleUrls: ['./simple-dialog-modal.component.scss'],
})
export class SimpleDialogModalComponent implements OnInit {
    @Input() message: string;

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController
    ) {}

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async accept(): Promise<void> {
        await this.navCtrl.navigateRoot('/end-task');
        await this.dismiss();
    }

    ngOnInit() {}

}
