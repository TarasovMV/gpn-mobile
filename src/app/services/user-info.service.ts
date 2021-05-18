import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SimpleModalComponent} from "../@shared/simple-modal/simple-modal.component";
import {ModalController} from "@ionic/angular";
import {ActivityModalComponent} from "../@shared/activity-modal/activity-modal.component";

export interface IUser {
    firstName: string;
    lastName: string;
    patronymic: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
    public readonly currentUser: IUser = {
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
    };
    public statusIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    public carNumber$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // Выбранный таб в модальном окне
    public currentTab$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(public modalController: ModalController) { }

    public async openActivityModal(): Promise<void> {
        this.presentModalPassword().then();
    }

    private async presentModalPassword() {
        const modal = await this.modalController.create({
            component: ActivityModalComponent,
            cssClass: 'activity-modal',
        });
        return await modal.present();
    }
}
