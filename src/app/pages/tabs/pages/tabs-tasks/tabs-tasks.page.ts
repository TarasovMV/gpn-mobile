import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {NEW_TASKS, TASKS_IN_PROGRESS} from './mock';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {ModalController, NavController} from '@ionic/angular';
import {ChooseTaskOverlayComponent} from './components/choose-task-overlay/choose-task-overlay.component';
import {TasksService} from "../../../../services/tasks.service";

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
        private tasksService: TasksService,
    ) {}


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
        const present = await this.presentModal();
        await present.onDidDismiss();
    }

    public openMap(): void {
        this.navCtrl.navigateRoot('/map').then();
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
