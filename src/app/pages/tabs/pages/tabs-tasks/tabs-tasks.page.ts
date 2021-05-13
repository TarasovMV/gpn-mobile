import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {ModalController, NavController} from '@ionic/angular';
import {ChooseTaskOverlayComponent} from './components/choose-task-overlay/choose-task-overlay.component';

export interface ITasksItem {
    num: string;
    manufacture: string;
    tare: number;
    test: number;
    checked?: boolean;
}

@Component({
    selector: 'app-tabs-tasks',
    templateUrl: './tabs-tasks.page.html',
    styleUrls: ['./tabs-tasks.page.scss'],
})
export class TabsTasksPage implements OnInit, IPageTab {
    public route: PageTabType = 'tasks';

    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['новые', 'выполняются']);

    public inProgressItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>([]);
    public newItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>([]);

    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController,
        private navCtrl: NavController,
    ) {
    }


    ngOnInit() {
        this.tabsService.tasksCurrentTab$.subscribe(value => {
            this.currentTab$.next(value);
        });
        this.tabsService.inProgressItems$.subscribe(val => {
            this.inProgressItems$.next(val);
        });
        this.tabsService.newItems$.subscribe(val => {
            this.newItems$.next(val);
        });
    }

    public changeTab(i): void {
        this.currentTab$.next(i);
    }

    public async openChooseOverlay(): Promise<void> {
        await this.accept();
    }

    public openMap(): void {
        this.navCtrl.navigateRoot('/map').then();
    }

    public async accept(): Promise<void> {
        await this.navCtrl.navigateRoot('nfc');
    }

    private async presentModal(): Promise<HTMLIonModalElement> {
        const modal = await this.modalController.create({
            component: ChooseTaskOverlayComponent,
            cssClass: 'choose-task'
        });
        await modal.present();
        return modal;
    }
}
