import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {DELIVERED, SELECTED} from './mock';
import {NavController} from "@ionic/angular";


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
    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['в машине', 'в елк']);

    public selectedItems$: BehaviorSubject<IDeliveryItems[]> = new BehaviorSubject<IDeliveryItems[]>(SELECTED);
    public deliveredItems$: BehaviorSubject<IDeliveryItems[]> = new BehaviorSubject<IDeliveryItems[]>(DELIVERED);

    public currentTab = 0;
    constructor(
        private navCtrl: NavController,
    ) {
    }

    ngOnInit() {
    }

    public changeTab(i): void {
        this.currentTab = i;
    }

    public toNfc(): void {
        this.navCtrl.navigateRoot('/nfc').then();
    }

}
