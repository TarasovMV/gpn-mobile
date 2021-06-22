import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MAIN_PAGE_DATA} from '../../pages/tabs/pages/tabs-main/mock';
import {IDiagram} from '../../pages/tabs/pages/tabs-main/tabs-main.page';
import {NEW_TASKS, TASKS_IN_PROGRESS} from '../../pages/tabs/pages/tabs-tasks/mock';
import {ITasksItem} from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';
import {DELIVERED, SELECTED} from '../../pages/tabs/pages/tabs-ready/mock';
import {IDeliveryItems} from '../../pages/tabs/pages/tabs-ready/tabs-ready.page';

@Injectable({
  providedIn: 'root'
})
export class TabsInfoService {
    public diagramData$: BehaviorSubject<IDiagram> = new BehaviorSubject<IDiagram>(MAIN_PAGE_DATA);
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public currentTask$: BehaviorSubject<ITasksItem> = new BehaviorSubject<ITasksItem>(null);

    public inProgressItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>(TASKS_IN_PROGRESS);
    public newItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>(NEW_TASKS);

    public selectedItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>([]);
    public deliveredItems$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>([]);

    constructor() { }
}
