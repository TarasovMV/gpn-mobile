import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDiagram } from '../../pages/tabs/pages/tabs-main/tabs-main.page';
import { ICoord } from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../@core/services/api/api.service';
import { UserInfoService } from '../user-info.service';
import { IRoute, ITask, ITaskData } from '../../@core/model/task.model';
import { TasksApiService } from './tasks-api.service';
import { ISelectOption } from '../../@shared/select/select.interfaces';
import { SimpleModalComponent } from '../../@shared/modals/simple-modal/simple-modal.component';
import { ModalController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class TabsInfoService {
    public diagramData$: BehaviorSubject<IDiagram> =
        new BehaviorSubject<IDiagram>(null);
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(
        0
    );

    public currentTask$: BehaviorSubject<ITask | { id: number }> =
        new BehaviorSubject<ITask | { id: number }>(null);
    public pushInfo: BehaviorSubject<number> = new BehaviorSubject<number>(
        null
    );

    public newItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>(
        []
    );
    public selectedItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<
        ITask[]
    >([]);
    public finalizesItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<
        ITask[]
    >([]);

    public routes$: BehaviorSubject<IRoute[]> = new BehaviorSubject<IRoute[]>(
        []
    );

    public reasonsList$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<
        ISelectOption[]
    >([]); // Причины завершения задания

    public readonly elkTask: { id: number; plantName: string } = {
        id: null,
        plantName: 'ЕЛК',
    };

    private taskDataCopy: ITaskData = null;

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private tasksApi: TasksApiService,
        private userInfo: UserInfoService,
        private modalController: ModalController
    ) {
        this.userInfo.workShift$.subscribe((id) => {
            if (id != null) {
                this.getTasks().then();
            }
        });
    }

    public startMove(): void {
        console.log('Движение началось');
    }

    public endMove(): void {
        console.log('Движение закончилось');
    }

    public cancelData(): void {
        console.log('Приложение запустилось что-то сбросилось');
    }

    public async getTasks(): Promise<void> {
        const tasksData: ITaskData = await this.tasksApi.getTasks(
            this.userInfo.currentUser.userId
        );
        const tasks = tasksData?.tasks ?? [];

        this.checkPushNotification(this.taskDataCopy?.tasks, tasks);

        this.taskDataCopy = {
            ...tasksData,
            tasks: [...tasksData.tasks],
            route: [...tasksData.route],
        };

        this.newItems$.next(
            tasks.filter((item) => !item.isFinalized && !item.inCar)
        );
        this.finalizesItems$.next(
            tasks.filter((item) => item.isFinalized && !item.inCar)
        );
        this.selectedItems$.next(
            tasks.filter((item) => item.inCar && !item.isFinalized)
        );
        this.routes$.next(tasksData.route);
    }

    public getRoutes(taskId: number): ICoord[] {
        const route = this.routes$
            .getValue()
            .filter((item) => item.taskId === taskId)
            .map((item) => ({
                x: item.point.y,
                y: item.point.x,
            }));
        return route;
    }

    public async goToNextTask(): Promise<void> {
        const newTasks = this.newItems$.getValue();
        const selectedTasks = this.selectedItems$.getValue();
        const currentTaskId = this.currentTask$.getValue().id;

        const res = await this.tasksApi.finalizeTask(currentTaskId, {});
        if (res) {
            this.newItems$.next(
                newTasks.filter((item) => item.id !== currentTaskId)
            );

            this.selectedItems$.next([
                ...selectedTasks,
                ...newTasks.filter((item) => item.id === currentTaskId),
            ]);

            if (this.newItems$.getValue().length === 0) {
                this.currentTask$.next(this.elkTask);
            }
            await this.getTasks();
        }
    }

    public async endTasks(): Promise<void> {
        const selectedTasks = this.selectedItems$.getValue();
        const finalizedTasks = this.finalizesItems$.getValue();
        const userId = this.userInfo.currentUser.userId;

        const res = await this.tasksApi.finalizeAllTasks({ userId });
        const resNumbers = (res ?? []).map((item) => item.taskNumber);
        if (res.length > 0) {
            this.selectedItems$.next(
                selectedTasks.filter(
                    (item) => !resNumbers.includes(+item.number)
                )
            );

            this.finalizesItems$.next([
                ...finalizedTasks,
                ...selectedTasks.filter(
                    (item) => !!resNumbers.includes(+item.number)
                ),
            ]);
            await this.getTasks();
        }
    }

    public async declineTask(id: number, reasonId: number): Promise<void> {
        const body = { taskDeclineReasonId: reasonId };
        await this.tasksApi.declineTask(id, body);
        await this.getTasks();
    }

    public async getReasons(): Promise<void> {
        try {
            const res = await this.tasksApi.getReasonsList();
            const resMap = res.map((item) => ({
                id: item.id,
                value: item.reasonDescription,
            }));
            this.reasonsList$.next([...resMap]);
        } catch (e) {
            console.error(e);
        }
    }

    public async disabledBtn(msg: string) {
        const modal = await this.modalController.create({
            componentProps: {
                message: msg,
            },
            component: SimpleModalComponent,
            cssClass: 'custom-modal resolve-modal',
        });
        return await modal.present();
    }

    private checkPushNotification(
        previous: ITask[],
        current: ITask[]
    ): boolean {
        // Список id задач до и после запроса
        const previousId = (previous ?? []).map((x) => x.id);
        const currentId = current.map((x) => x.id);

        let newTasksCount = 0;
        currentId.forEach((item) => {
            if (!previousId.includes(item)) {
                newTasksCount++;
            }
        });

        if (newTasksCount > 0) {
            console.log('Новых задач: ' + newTasksCount);
            this.pushInfo.next(newTasksCount);
            return true;
        }
        return false;
    }
}
