import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {DELIVERED, SELECTED} from './mock';


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
    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['отобранные', 'доставленные']);

    public selectedItems$: BehaviorSubject<IDeliveryItems[]> = new BehaviorSubject<IDeliveryItems[]>(SELECTED);
    public deliveredItems$: BehaviorSubject<IDeliveryItems[]> = new BehaviorSubject<IDeliveryItems[]>(DELIVERED);

    public currentTab = 0;
    constructor() {
    }

    ngOnInit() {
    }

    public changeTab(i): void {
        this.currentTab = i;
    }

}
