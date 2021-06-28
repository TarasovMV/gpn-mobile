import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {NfcTimerModalComponent} from '../nfc-timer-modal/nfc-timer-modal.component';
import {TasksService} from '../../../../services/tasks.service';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

@Component({
    selector: 'app-verify-modal',
    templateUrl: './verify-modal.component.html',
    styleUrls: ['./verify-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyModalComponent {
    constructor(
        public modalCtrl: ModalController,
        public tabsService: TabsInfoService
    ) {
    }

    public async close(): Promise<void> {
        await this.modalCtrl.dismiss();
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
                component: NfcTimerModalComponent,
                cssClass: 'nfc-timer-modal',
                backdropDismiss: true
            }
        );
        await modal.present();
        // await modal.present();
    }

    public async presentNfcTimerModal(): Promise<void> {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({component: NfcTimerModalComponent, cssClass: 'nfc-timer-modal'});
        await modal.present();
    }
}
