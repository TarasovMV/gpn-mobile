import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api/api.service';
import {EStatus, UserInfoService} from './user-info.service';
import { ITask, ITaskData } from '../model/task.model';
import { TasksApiService } from './api/tasks-api.service';
import { ISelectOption } from '../../@shared/select/select.interfaces';
import { SimpleModalComponent } from '../../@shared/modals/simple-modal/simple-modal.component';
import { ModalController } from '@ionic/angular';
import { IGpsService } from '../model/gps.model';
import {GRAPH} from './graphs/graph.const';
import {filter, map} from 'rxjs/operators';
import {GPS} from '../tokens';
import {SavedObservable} from '../classes/saved-observable';


@Injectable({
    providedIn: 'root',
})
export class TabsInfoService {
    public readonly currentTask$: BehaviorSubject<ITask> = new BehaviorSubject<ITask>(null);

    public readonly tasks$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
    public readonly newItems$: SavedObservable<ITask[]> =
        new SavedObservable<ITask[]>(this.tasks$.pipe(map(x => x.filter(t => !t.isFinalized && !t.inCar))));
    public readonly selectedItems$: SavedObservable<ITask[]> =
        new SavedObservable<ITask[]>(this.tasks$.pipe(map(x => x.filter(t => !t.isFinalized && t.inCar))));
    public readonly finalizesItems$: SavedObservable<ITask[]> =
        new SavedObservable<ITask[]>(this.tasks$.pipe(map(x => x.filter(t => t.isFinalized && !t.inCar))));

    public readonly currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public readonly pushInfo$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public readonly reasonsList$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]); // Причины завершения задания

    public readonly elkTask: ITask = {
        id: null,
        plantName: 'ЕЛК',
        node: {
            id: 107,
            point: {
                x: 8154008.430547221,
                y: 7374383.438178856
            }
        }
    };

    public fakeModalTaskId: number = -1;
    private taskDataCopy: ITaskData = null;
    private readonly deletedIdsCache: number[] = [];

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

    public async getTasks(): Promise<void> {
        const id = this.userInfo?.currentUser?.userId;
        const workShiftId = this.userInfo.workShift$.getValue();
        const statusId = this.userInfo.statusId$.getValue();
        if (!id || !workShiftId) {
            return;
        }

        const tasksData: ITaskData = await this.tasksApi.getTasks(id);
        let tasks = tasksData?.tasks ?? [];
        const hasExtraTask = tasks.some(t => !t.isFinalized && !t.inCar && t?.isExtra);

        if (statusId !== EStatus.notActive || hasExtraTask) {
            tasks = tasks.filter(t => this.deletedIdsCache.findIndex(d => d === t.id) === -1);

            tasks.forEach((item) => {
                item.probes = item.probes.map(probe => ({...probe, checked: false}));
                item.tares = item.tares.map(probe => ({...probe, checked: false}));
                const pointId = `locker${item.lockerId}`;
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

            let currentTasks = [...this.tasks$.getValue()];

            const freshTasks = tasks.filter(t => currentTasks.findIndex((c) => t.id === c.id) === -1);
            currentTasks = currentTasks.filter(c => tasks.findIndex(t => t.id === c.id) !== -1);

            this.tasks$.next([...currentTasks, ...freshTasks]);
        }
    }

    public async goToNextTask(): Promise<void> {
        const currentTaskId = this.currentTask$.getValue().id;

        this.tasksApi.finalizeTask(currentTaskId, {}).then();

        const tasks = this.tasks$.getValue();
        tasks.forEach(x => {
            if(x.id === currentTaskId) {
                x.inCar = true;
            }
        });
        this.tasks$.next([...tasks]);
    }

    public async endTasks(): Promise<void> {
        const userId = this.userInfo.currentUser.userId;

        this.userInfo.changeStatus(EStatus.notActive);
        // const position = await this.gpsService.getCurrentPosition.pipe(map(x => positionStringify(x.coords))).toPromise();
        this.tasksApi.finalizeAllTasks({ userId, position: '' }).then();

        const tasks = this.tasks$.getValue();
        tasks.forEach(x => {
            if(x.inCar && !x.isFinalized) {
                x.inCar = false;
                x.isFinalized = true;
            }
        });
        this.tasks$.next([...tasks]);
    }

    public isAllTasksEnded(): Observable<boolean> {
        const isEnd$ = combineLatest([
            this.newItems$,
            this.selectedItems$,
        ]).pipe(map((data)=> data.every(item => item.length === 0)));
        return isEnd$;
    }

    public async failTask(id: number, reasonId: number, comment: string,): Promise<void> {
        const body = { taskDeclineReasonId: reasonId, comment };
        this.tasksApi.failTask(id, body).then();

        let tasks = this.tasks$.getValue();
        tasks = tasks.filter(x => x.id !== id);
        this.tasks$.next([...tasks]);

        this.deletedIdsCache.push(id);
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
