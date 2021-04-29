import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject, Subject} from 'rxjs';
import {NEW_TASKS, TASKS_IN_PROGRESS} from './mock';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {CarPopowerComponent} from '../../../login/components/car-popower/car-popower.component';
import {ModalController} from '@ionic/angular';
import {ChooseTaskOverlayComponent} from "./components/choose-task-overlay/choose-task-overlay.component";

export interface ITasksItem {
    num: string;
    manufacture: string;
    tare: number;
    test: number;
}

@Component({
    selector: 'app-tabs-tasks',
    templateUrl: './tabs-tasks.page.html',
    styleUrls: ['./tabs-tasks.page.scss'],
})
export class TabsTasksPage implements OnInit, IPageTab {
    public route: PageTabType = 'tasks';


    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['новые', 'выполняются']);

    public inProgressItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>(TASKS_IN_PROGRESS);
    public newItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>(NEW_TASKS);

    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController
    ) {}

    ngOnInit() {
        this.tabsService.tasksCurrentTab$.subscribe(value => {
            this.currentTab$.next(value);
        });
    }

    public changeTab(i): void {
        this.currentTab$.next(i);
    }

    public openChooseOverlay(): void {

    }

    private async presentModal() {
        const modal = await this.modalController.create({
            component: ChooseTaskOverlayComponent,
            cssClass: 'choose-task'
        });
        return await modal.present();
    }
}
