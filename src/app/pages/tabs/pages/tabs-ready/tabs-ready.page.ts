import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {DELIVERED, SELECTED} from './mock';
import {ModalController, NavController} from '@ionic/angular';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {NfcTimerModalComponent} from '../../../nfc-verify/components/nfc-timer-modal/nfc-timer-modal.component';


export interface IDeliveryItems {
    num: string;
    manufacture: string;
}

@Component({
    selector: 'app-tabs-ready',
    templateUrl: './tabs-ready.page.html',
    styleUrls: ['./tabs-ready.page.scss'],
})

export class TabsReadyPage implements OnInit, IPageTab {
    public route: PageTabType = 'ready';
    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['в машине', 'завершено']);
    constructor(
        private navCtrl: NavController,
        public tabsService: TabsInfoService,
        public modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
    }

    public changeTab(i): void {
        this.tabsService.currentTab$.next(i);
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
                component:  NfcTimerModalComponent,
                cssClass: 'nfc-timer-modal',
                backdropDismiss: true
            }
        );
        await modal.present();
    }

    public async toNfc(): Promise<void> {
        if (!this.tabsService.newItems$.value.length) {
            await this.openModal();
        }
    }

}
