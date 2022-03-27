import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {UserInfoService} from '../../@core/services/user-info.service';
import {CarPopowerComponent} from '../../pages/login/components/car-popower/car-popower.component';

export interface IStatusColor {
    color?: string;
    bgColor?: string;
}

export interface IStatusInfo extends IStatusColor{
    state: string;
    id: number;
}

@Component({
  selector: 'app-avatar-modal',
  templateUrl: './avatar-modal.component.html',
  styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent implements OnInit {
    public readonly tabs: string[] = [
        'Информация',
        'обучение',
        'тех. поддержка'
    ];

    constructor(
        private navCtrl: NavController,
        public userInfo: UserInfoService,
        public modalController: ModalController
    ) { }

    ngOnInit() {}

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    public changeUser(): void {
        this.navCtrl.navigateRoot('/login').then();
        this.dismiss();
    }

    public changeCar(): void {
        this.presentModal().then();
    }

    public selectTab(idx: number): void {
        this.userInfo.currentTab$.next(idx);
    }

    private async presentModal() {
        const modal = await this.modalController.create({
            component: CarPopowerComponent,
            cssClass: 'car-modal'
        });
        return await modal.present();
    }
}
