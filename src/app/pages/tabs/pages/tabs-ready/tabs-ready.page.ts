import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';

@Component({
    selector: 'app-tabs-ready',
    templateUrl: './tabs-ready.page.html',
    styleUrls: ['./tabs-ready.page.scss'],
})
export class TabsReadyPage implements OnInit, IPageTab {
    public route: PageTabType = 'ready';

    constructor() {
    }

    ngOnInit() {
    }

}
