import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {NEW_TASKS, TASKS_IN_PROGRESS} from './mock';
import {NavController} from "@ionic/angular";
import {TasksService} from "../../../../services/tasks.service";

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

    public currentTab = 0;
    constructor(
        private navCtrl: NavController,
        private tasksService: TasksService
    ) {}

    ngOnInit() {
    }

    public changeTab(i): void {
        this.currentTab = i;
    }

    public accept() {
        this.newItems$.subscribe((data : ITasksItem[]) => {
            this.tasksService.currentTask = data[0];
        })
        this.navCtrl.navigateRoot("nfc").then();
    }
}
