import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-dialog-modal',
    templateUrl: './dialog-modal.component.html',
    styleUrls: ['./dialog-modal.component.scss'],
})
export class DialogModalComponent implements OnInit {
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
