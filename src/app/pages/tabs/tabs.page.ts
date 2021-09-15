import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavController} from '@ionic/angular';
import {UserInfoService} from "../../services/user-info.service";
import {TasksService} from "../../services/tasks.service";
import {TabsInfoService} from "../../services/tabs/tabs-info.service";

export interface IPageTab {
    readonly route: PageTabType;
    readonly name?: string;
}

export type PageTabType = 'main' | 'tasks' | 'ready';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
    public currentTab$: BehaviorSubject<PageTabType> = new BehaviorSubject<PageTabType>('main');

    public readonly tabs: IPageTab[] = [
        {
            route: 'main',
            name: 'Главная',
        },
        {
            route: 'tasks',
            name: 'Задания'
        },
        {
            route: 'ready',
            name: 'Выполнено'
        }
    ];

    private readonly tabsRouting: {[key in PageTabType]: string} = {
        main: 'tabs/tabs-main',
        tasks: 'tabs/tabs-tasks',
        ready: 'tabs/tabs-ready',
    };

    constructor(private navCtrl: NavController, private userService: UserInfoService, private taskService: TabsInfoService) {}

    ngOnInit() {}

    public selectTab(tab: IPageTab): void {
        this.navCtrl.navigateRoot(this.tabsRouting[tab.route] ?? this.tabsRouting[this.currentTab$.value]).then();
    }

    public routing(tab: IPageTab): void {
        this.currentTab$.next(tab.route);
    }

}
