import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ActivityModalComponent } from '../@shared/activity-modal/activity-modal.component';
import {
    IStatusColor,
    IStatusInfo,
} from '../@shared/avatar-modal/avatar-modal.component';
import { IUser, IUserCredentials } from '../@core/model/user.model';
import { ApiService } from '../@core/services/api/api.service';
import { IVehicle } from '../@core/model/vehicle.model';
import { IWorkShiftEnd } from '../@core/model/workshift.model';

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
    public carNumber$: BehaviorSubject<string> = new BehaviorSubject<string>(
        ''
    );
    public statusList$: BehaviorSubject<IStatusInfo[]> = new BehaviorSubject<
        IStatusInfo[]
    >([]);

    // Выбранный таб в модальном окне
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(
        0
    );

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
    };

    private readonly defaultUser: Partial<IUser> = {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
    };

    public endStatistic$: BehaviorSubject<IWorkShiftEnd> =
        new BehaviorSubject<IWorkShiftEnd>(null);

    constructor(
        public modalController: ModalController,
        private apiService: ApiService
    ) {
        // this.statusId$.subscribe(async (item) => {
        //     const workShiftId = this.workShift$.getValue();
        //     const driverStateId = this.statusId$.getValue();
        //     if (item >= 0 && workShiftId && driverStateId) {
        //         await this.apiService.changeStatus({
        //             workShiftId,
        //             driverStateId,
        //         });
        //     }
        // });
    }

    public async openActivityModal(): Promise<void> {
        this.presentModalPassword().then();
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
        this.workShift$.next(workShift.id);
        this.statusId$.next(workShift.driverStateId);
    }

    public async setWorkShift(): Promise<void> {
        const userId = this.currentUser.userId;
        const vehicleId = this.car$.getValue().id;
        const driverStateId = this.statusId$.getValue();

        const workShift = await this.apiService.setWorkShift({
            userId,
            vehicleId,
            driverStateId,
        });
        this.workShift$.next(workShift.id);
    }

    public async endWorkShift(): Promise<void> {
        const userId = this.currentUser.userId;
        const res = await this.apiService.endWorkShift({ userId });

        this.carNumber$.next(null);
        this.statusId$.next(null);
        this.workShift$.next(null);
        this.endStatistic$.next(res);
    }

    private async presentModalPassword() {
        const modal = await this.modalController.create({
            component: ActivityModalComponent,
            cssClass: 'activity-modal',
        });
        return await modal.present();
    }
}
