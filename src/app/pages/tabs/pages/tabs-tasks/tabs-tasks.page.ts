import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';

@Component({
    selector: 'app-tabs-tasks',
    templateUrl: './tabs-tasks.page.html',
    styleUrls: ['./tabs-tasks.page.scss'],
})
export class TabsTasksPage implements OnInit, IPageTab {
    public route: PageTabType = 'tasks';

    constructor() {
    }

    ngOnInit() {
    }

}
