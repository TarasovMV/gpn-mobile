import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NavController} from '@ionic/angular';

export interface IPageTab {
    readonly tabName: PageTabType;
}

export type PageTabType = 'main' | 'tasks' | 'ready';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
    public currentTab$: BehaviorSubject<PageTabType> = new BehaviorSubject<PageTabType>('main');

    public readonly tabs: PageTabType[] = ['main', 'tasks', 'ready'];
    private readonly tabsRouting: {[key in PageTabType]: string} = {
        main: 'tabs/tabs-main',
        tasks: 'tabs/tabs-tasks',
        ready: 'tabs/tabs-ready',
    };

    constructor(private navCtrl: NavController) {}

    ngOnInit(): void {}

    public selectTab(tab: PageTabType): void {
        this.navCtrl.navigateRoot(this.tabsRouting[tab] ?? this.tabsRouting[this.currentTab$.value]).then();
    }

    public routing(event: IPageTab): void {
        this.currentTab$.next(event?.tabName);
    }

}
