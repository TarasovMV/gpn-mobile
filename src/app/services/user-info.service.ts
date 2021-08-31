import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ActivityModalComponent} from '../@shared/activity-modal/activity-modal.component';
import {IStatusInfo} from '../@shared/avatar-modal/avatar-modal.component';
import {IUser, IUserCredentials} from '../@core/model/user.model';
import {ApiService} from '../@core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
    public currentUser: IUser = null;
    public statusIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    public carNumber$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public statusList$: BehaviorSubject<IStatusInfo[]> = new BehaviorSubject<IStatusInfo[]>([
        {
            name: 'Свободен',
            color: '#00A73D',
            bgColor: 'rgba(0, 167, 61, 0.2)'
        },
        {
            name: 'Занят',
            color: '#F7931E',
            bgColor: 'rgba(247, 147, 30, 0.2)'
        },
        {
            name: 'Не активен',
            color: '#FF1D25',
            bgColor: 'rgba(255, 29, 37, 0.2)'
        }
    ]);

    // Выбранный таб в модальном окне
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private readonly defaultUser: Partial<IUser> = {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
    };

    constructor(
        public modalController: ModalController,
        private apiService: ApiService,
    ) { }

    public async openActivityModal(): Promise<void> {
        this.presentModalPassword().then();
    }

    public async auth(cred: IUserCredentials): Promise<IUser> {
        let user = await this.apiService.userAuth(cred);
        user = {...this.defaultUser, ...user};
        this.currentUser = user;
        return user;
    }

    private async presentModalPassword() {
        const modal = await this.modalController.create({
            component: ActivityModalComponent,
            cssClass: 'activity-modal',
        });
        return await modal.present();
    }
}
