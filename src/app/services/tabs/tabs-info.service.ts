import {Inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../@core/services/api/api.service';
import {EStatus, UserInfoService} from '../user-info.service';
import { IRoute, ITask, ITaskData } from '../../@core/model/task.model';
import { TasksApiService } from './tasks-api.service';
import { ISelectOption } from '../../@shared/select/select.interfaces';
import { SimpleModalComponent } from '../../@shared/modals/simple-modal/simple-modal.component';
import { ModalController } from '@ionic/angular';
import {ICoordinate, IGpsService} from '../../@core/model/gps.model';
import {GRAPH} from '../graphs/graph.const';
import {filter, map} from 'rxjs/operators';
import {GPS} from '../../@core/tokens';
import {positionStringify} from '../../@core/functions/position-stringify.function';

@Injectable({
    providedIn: 'root',
})
export class TabsInfoService {
    public readonly currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public readonly currentTask$: BehaviorSubject<ITask> = new BehaviorSubject<ITask>(null);
    public readonly pushInfo$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public readonly newItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
    public readonly selectedItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
    public readonly finalizesItems$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
    public readonly routes$: BehaviorSubject<IRoute[]> = new BehaviorSubject<IRoute[]>([]);
    public readonly reasonsList$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]); // Причины завершения задания

    public readonly elkTask: ITask = {
        id: null,
        plantName: 'ЕЛК',
        // TODO: add nodes params
        node: {
            id: '',
            point: {x: 0, y: 0}
        }
    };

    public fakeModalTaskId: number = -1;
    private taskDataCopy: ITaskData = null;

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private tasksApi: TasksApiService,
        private userInfo: UserInfoService,
        private modalController: ModalController,
        @Inject(GPS) private gpsService: IGpsService,
    ) {
        this.userInfo.workShift$
            .pipe(filter(id => id != null))
            .subscribe((id) => this.getTasks().then());
    }

    // TODO: узнать что делать при получении нового задания (придумать что делать с currentTask$)
    public async getTasks(): Promise<void> {
        const id = this.userInfo?.currentUser?.userId;
        const workShiftId = this.userInfo.workShift$.getValue();
        if (!id || !workShiftId) {
            return;
        }

        const tasksData: ITaskData = await this.tasksApi.getTasks(id);
        const tasks = tasksData?.tasks ?? [];

        tasks.forEach((item) => {
            item.probes = item.probes.map(probe => ({...probe, checked: false}));
            item.tares = item.tares.map(probe => ({...probe, checked: false}));
            const pointId = tasksData.route.filter(x => x.taskId === item.id)?.slice(-1)?.[0]?.pointId;
            item.node = {
                id: pointId,
                // нестрогое сравнение оставить
                // eslint-disable-next-line eqeqeq
                point: !!pointId ? GRAPH.nodes.find(x => x.id == pointId) : undefined,
            };
        });

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

        if (this.newItems$.getValue()?.length && this.currentTask$.getValue() !== this.newItems$.getValue()[0]) {
            const newTasks = this.newItems$.getValue();
            const prevId = this.currentTask$.getValue()?.id;
            const curId = newTasks[0]?.id;
            if(curId !== prevId) {
                this.currentTask$.next(this.newItems$.getValue()[0]);
            }
        }
    }

    // TODO: refactor to return with id
    public getRoutes(taskId: number): ICoordinate[] {
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

            if (this.newItems$.getValue().length === 0 && this.selectedItems$.getValue().length !== 0) {
                this.currentTask$.next(this.elkTask);
            } else {
                this.currentTask$.next(null);
            }
        }
        await this.getTasks();
    }

    public async endTasks(): Promise<void> {
        const selectedTasks = this.selectedItems$.getValue();
        const finalizedTasks = this.finalizesItems$.getValue();
        const userId = this.userInfo.currentUser.userId;

        this.currentTask$.next(null);

        this.userInfo.changeStatus(EStatus.free);
        // const position = await this.gpsService.getCurrentPosition.pipe(map(x => positionStringify(x.coords))).toPromise();
        const res = await this.tasksApi.finalizeAllTasks({ userId, position: '' });
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

    public async failTask(
        id: number,
        reasonId: number,
        comment
    ): Promise<void> {
        const body = { taskDeclineReasonId: reasonId, comment };
        await this.tasksApi.failTask(id, body);
        await this.getTasks();
    }

    public async getReasons(): Promise<void> {
        try {
            const res = await this.tasksApi.getReasonsList();
            const resMap = res.map((item) => ({
                id: item.id,
                value: item.name,
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
        const previousId = (previous ?? [])
            .filter((item) => !item.isFinalized && !item.inCar)
            .map((x) => x.id);
        const currentId = current
            .filter((item) => !item.isFinalized && !item.inCar)
            .map((x) => x.id);

        let newTasksCount = 0;
        currentId.forEach((item) => {
            if (!previousId.includes(item)) {
                newTasksCount++;
            }
        });

        if (newTasksCount > 0) {
            console.log('Новых задач: ' + newTasksCount);
            this.fakeModalTaskId = currentId?.[1] ?? -1;
            this.pushInfo$.next(newTasksCount);
            return true;
        }
        return false;
    }
}
