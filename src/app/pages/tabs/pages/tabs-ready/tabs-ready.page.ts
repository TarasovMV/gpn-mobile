import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {DELIVERED, SELECTED} from './mock';
import {NavController} from "@ionic/angular";
import {TabsInfoService} from "../../../../services/tabs/tabs-info.service";


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
        public tabsService: TabsInfoService
    ) {
    }

    ngOnInit() {
    }

    public changeTab(i): void {
        this.tabsService.currentTab$.next(i);
    }

    public toNfc(): void {
        this.navCtrl.navigateRoot('/nfc').then();
    }

}
