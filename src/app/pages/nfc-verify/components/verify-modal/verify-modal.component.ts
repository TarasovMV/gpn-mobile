import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModalController} from "@ionic/angular";

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

    async close(): Promise<void> {
        await this.modalCtrl.dismiss();
    }
}
