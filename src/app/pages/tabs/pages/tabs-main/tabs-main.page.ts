import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';

@Component({
    selector: 'app-tabs-main',
    templateUrl: './tabs-main.page.html',
    styleUrls: ['./tabs-main.page.scss'],
})
export class TabsMainPage implements OnInit, IPageTab {
    public tabName: PageTabType = 'main';

    constructor() {
    }

    ngOnInit() {
    }

}
