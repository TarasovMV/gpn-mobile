import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {ITasksItem} from '../tabs/pages/tabs-tasks/tabs-tasks.page';
import {TabsInfoService} from "../../services/tabs/tabs-info.service";
import {BehaviorSubject} from "rxjs";
import {NfcTimerModalComponent} from "./components/nfc-timer-modal/nfc-timer-modal.component";
import {VerifyModalComponent} from "./components/verify-modal/verify-modal.component";

@Component({
    selector: 'app-nfc-verify.page',
    templateUrl: './nfc-verify.page.html',
    styleUrls: ['./nfc-verify.page.scss']
})
export class NfcVerifyPage implements OnInit {
    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        public tabsService: TabsInfoService
    ) {
    }

    public ngOnInit(): void {}

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
                component: VerifyModalComponent,
                cssClass: 'nfc-verify-modal',
                backdropDismiss: true
            }
        );
        await modal.present();
        // await modal.present();
    }

    public async enableNfc(): Promise<void> {
        await this.openModal();
    }

    public back(): void {
        this.navCtrl.back();
    }
}
