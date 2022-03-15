import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import { NavController } from '@ionic/angular';
import { UserInfoService } from '../../services/user-info.service';
import {PreloaderService} from '../../@core/services/platform/preloader.service';
import {delay, mergeMap} from 'rxjs/operators';

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
    public currentTab$: BehaviorSubject<PageTabType> =
        new BehaviorSubject<PageTabType>('main');

    public readonly tabs: IPageTab[] = [
        {
            route: 'main',
            name: 'Главная',
        },
        {
            route: 'tasks',
            name: 'Задания',
        },
        {
            route: 'ready',
            name: 'Выполнено',
        },
    ];

    private readonly tabsRouting: { [key in PageTabType]: string } = {
        main: 'tabs/tabs-main',
        tasks: 'tabs/tabs-tasks',
        ready: 'tabs/tabs-ready',
    };

    constructor(
        private navCtrl: NavController,
        private preloader: PreloaderService,
        private userInfo: UserInfoService
    ) {}

    async ngOnInit() {
        const status$ = new BehaviorSubject(null);
        status$.pipe(delay(5000), mergeMap(() => this.userInfo.getCurrantStatus())).subscribe(res => {
            this.userInfo.statusId$.next(res.id);
            status$.next(res.id);
        });
    }

    public selectTab(tab: IPageTab): void {
        this.navCtrl
            .navigateRoot(
                this.tabsRouting[tab.route] ??
                    this.tabsRouting[this.currentTab$.value]
            )
            .then();
    }

    public routing(tab: IPageTab): void {
        this.currentTab$.next(tab.route);
    }
}
