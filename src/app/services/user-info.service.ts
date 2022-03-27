import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import {
    IStatusColor,
    IStatusInfo,
} from '../@shared/avatar-modal/avatar-modal.component';
import { IUser, IUserCredentials } from '../@core/model/user.model';
import { ApiService } from '../@core/services/api/api.service';
import { IVehicle } from '../@core/model/vehicle.model';
import {
    IWorkShiftEnd,
    IWorkShiftStatus,
} from '../@core/model/workshift.model';
import { SimpleModalComponent } from '../@shared/modals/simple-modal/simple-modal.component';
import { IGpsService } from '../@core/model/gps.model';
import { GPS } from '../@core/tokens';
import { map } from 'rxjs/operators';
import { positionStringify } from '../@core/functions/position-stringify.function';
import { PreloaderService } from '../@core/services/platform/preloader.service';

export enum EStatus {
    notActive = 1,
    busy = 2,
    free = 3,
    lunchTime = 4,
    pendingLunch = 5,
}

@Injectable({
    providedIn: 'root',
})
export class UserInfoService {
    public currentUser: IUser = null;
    public statusId$: BehaviorSubject<number> = new BehaviorSubject<number>(
        null
    );
    public workShift$: BehaviorSubject<number> = new BehaviorSubject<number>(
        null
    );
    public car$: BehaviorSubject<IVehicle> = new BehaviorSubject<IVehicle>(
        null
    );
    public carList$: BehaviorSubject<IVehicle[]> = new BehaviorSubject([]);

    public statusList$: BehaviorSubject<IStatusInfo[]> = new BehaviorSubject<
        IStatusInfo[]
    >([]);

    // Выбранный таб в модальном окне
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(
        0
    );

    public endStatistic$: BehaviorSubject<IWorkShiftEnd> =
        new BehaviorSubject<IWorkShiftEnd>(null);

    public readonly statusColors: { [key: string]: IStatusColor } = {
        1: {
            color: '#F7931E',
            bgColor: 'rgba(247, 147, 30, 0.2)',
        },

        3: {
            color: '#00A73D',
            bgColor: 'rgba(0, 167, 61, 0.2)',
        },
        2: {
            color: '#FF1D25',
            bgColor: 'rgba(255, 29, 37, 0.2)',
        },
        4: {
            color: '#FF1D25',
            bgColor: 'rgba(255, 29, 37, 0.2)',
        },
        5: {
            color: '#FF1D25',
            bgColor: 'rgba(255, 29, 37, 0.2)',
        },
    };

    private readonly defaultUser: Partial<IUser> = {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
    };

    constructor(
        public modalController: ModalController,
        private apiService: ApiService,
        private preloader: PreloaderService,
        @Inject(GPS) private gpsService: IGpsService
    ) {}

    public async openActivityModal(): Promise<void> {
        this.presentModalActivity().then();
    }

    public async auth(cred: IUserCredentials): Promise<IUser> {
        let user = await this.apiService.userAuth(cred);
        user = { ...this.defaultUser, ...user };
        this.currentUser = user;
        return user;
    }

    public async getStatus(): Promise<void> {
        const status = await this.apiService.getStatusList();
        status.forEach((item, i) => {
            status[i] = { ...item, ...this.statusColors[item.id] };
        });
        this.statusList$.next(status);
    }

    public async getWorkShift(): Promise<void> {
        const workShift = await this.apiService.getWorkShift(
            this.currentUser.userId
        );
        const car = await this.apiService.getVehicleById(workShift.vehicleId);
        this.workShift$.next(workShift.id);
        this.statusId$.next(workShift.driverStateId);
        this.car$.next(car);
    }

    public async setWorkShift(): Promise<void> {
        const userId = this.currentUser.userId;
        const vehicleId = this.car$.getValue().id;
        const driverStateId = this.statusId$.getValue();
        let position = '';
        await this.preloader.activate();
        try {
            position = await this.gpsService.getCurrentPosition
                .pipe(map((x) => positionStringify(x.coords)))
                .toPromise();
        } catch (e) {
        } finally {
            await this.preloader.disable();
        }

        const workShift = await this.apiService.setWorkShift({
            userId,
            vehicleId,
            driverStateId,
            position,
        });
        this.workShift$.next(workShift.id);
    }

    public async endWorkShift(): Promise<void> {
        const userId = this.currentUser.userId;
        const res = await this.apiService.endWorkShift({ userId });

        this.car$.next(null);
        this.statusId$.next(null);
        this.workShift$.next(null);
        this.endStatistic$.next(res);
    }

    public async changeStatus(id: number): Promise<void> {
        this.statusId$.next(EStatus.pendingLunch);

        const userId = this.currentUser?.userId;
        const params: IWorkShiftStatus = {
            isMobile: true,
            stateId: id,
            userId,
        };

        const acceptedStatus = await this.apiService.changeStatus(params);
        this.statusId$.next(acceptedStatus?.id);
    }

    public getCurrantStatus(): Observable<{ id: number; state: string }> {
        const userId = this.currentUser?.userId;
        const workShiftId = this.workShift$.getValue();
        if (userId && workShiftId) {
            return this.apiService.getCurrentStatus(userId);
        } else {
            return new Observable<{ id: number; state: string }>();
        }
    }

    private async presentModalActivity() {
        const modal = await this.modalController.create({
            componentProps: {
                message:
                    'Вы неактивны более 15 минут, если статус не будет изменен, задачи будут переназначены',
            },
            component: SimpleModalComponent,
            cssClass: 'custom-modal resolve-modal',
        });
        return await modal.present();
    }
}
