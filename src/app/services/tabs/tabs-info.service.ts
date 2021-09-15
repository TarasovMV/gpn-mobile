import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MAIN_PAGE_DATA } from '../../pages/tabs/pages/tabs-main/mock';
import { IDiagram } from '../../pages/tabs/pages/tabs-main/tabs-main.page';
import {
    NEW_TASKS,
    TASKS_IN_PROGRESS,
} from '../../pages/tabs/pages/tabs-tasks/mock';
import {
    ICoord,
    ITasksItem,
} from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';
import { DELIVERED, SELECTED } from '../../pages/tabs/pages/tabs-ready/mock';
import { IDeliveryItems } from '../../pages/tabs/pages/tabs-ready/tabs-ready.page';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../@core/services/api/api.service';
import { UserInfoService } from '../user-info.service';
import { IRoute, ITask, ITaskData } from '../../@core/model/task.model';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TabsInfoService {
    public diagramData$: BehaviorSubject<IDiagram> =
        new BehaviorSubject<IDiagram>(null);
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(
        0
    );

    public currentTask$: BehaviorSubject<ITask> = new BehaviorSubject<ITask>(
        null
    );
    public pushInfo: BehaviorSubject<number> = new BehaviorSubject<number>(
        null
    );

    public inProgressItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<
        ITask[]
    >([]);
    public newItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>(
        []
    );

    public selectedItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<
        ITask[]
    >([]);
    public deliveredItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<
        ITask[]
    >([]);

    public routes$: BehaviorSubject<IRoute[]> = new BehaviorSubject<IRoute[]>(
        []
    );

    private readonly restUrl: string =
        'https://tpmobs.koa.gazprom-neft.ru/mobile_web_api';

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private userInfo: UserInfoService
    ) {
        this.userInfo.workShift$.subscribe((id) => {
            if (id != null) {
                this.getTasks().then();
            }
        });
    }

    public startMove(): void {
        console.log('Движение началось');
        // this.startMoveRequest().then();
    }

    public endMove(): void {
        console.log('Движение закончилось');
        // this.endMoveRequest().then();
    }

    public cancelData(): void {
        console.log('Приложение запустилось что-то сбросилось');
        // this.cancelDataRequest().then();
    }

    public async startMoveRequest(): Promise<void> {
        try {
            await this.http
                .post(`${this.restUrl}/setStartMove`, {})
                .toPromise();
        } catch (e) {
            console.error(e);
        }
    }

    // public async endMoveRequest(): Promise<void> {
    //     try {
    //         await this.http.post(`${this.restUrl}/setStopMove`, {}).toPromise();
    //     } catch(e) {
    //         console.error(e);
    //     }
    // }
    //
    // public async cancelDataRequest(): Promise<void> {
    //     try {
    //         await this.http.post(`${this.restUrl}/setResetRoute`, {}).toPromise();
    //     } catch(e) {
    //         console.error(e);
    //     }
    // }

    public async getTasks(): Promise<void> {
        const tasksData: ITaskData = await this.apiService.getTasks(
            this.userInfo.currentUser.userId
        );

        const tasks = tasksData?.tasks ?? [];
        this.newItems$.next(tasks.filter((item) => !item.isFinalized));
        this.deliveredItems$.next(tasks.filter((item) => item.isFinalized));
        this.routes$.next(tasksData.route);

        this.pushInfo.next(this.newItems$.getValue().length);
    }

    public getRoutes(taskId: number): ICoord[] {
        const route = this.routes$
            .getValue()
            .filter((item) => item.taskId === taskId).map((item) => ({
                x: item.point.y,
                y: item.point.x
            }));
        return route;
    }
}
