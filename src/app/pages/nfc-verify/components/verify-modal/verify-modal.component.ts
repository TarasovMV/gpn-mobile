import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NfcTimerModalComponent} from "../nfc-timer-modal/nfc-timer-modal.component";

@Component({
    selector: 'app-verify-modal',
    templateUrl: './verify-modal.component.html',
    styleUrls: ['./verify-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyModalComponent {
    constructor(
        public modalCtrl: ModalController
    ) {
    }

    public async close(): Promise<void> {
        await this.modalCtrl.dismiss();
    }

    public async presentNfcTimerModal(): Promise<void> {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({component: NfcTimerModalComponent, cssClass: 'nfc-timer-modal'});
        await modal.present();
    }
}
