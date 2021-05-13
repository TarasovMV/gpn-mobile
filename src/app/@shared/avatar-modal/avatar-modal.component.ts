import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ModalController, NavController} from '@ionic/angular';
import {UserInfoService} from '../../services/user-info.service';
import {CarPopowerComponent} from '../../pages/login/components/car-popower/car-popower.component';
import {IPageTab, PageTabType} from "../../pages/tabs/tabs.page";

export interface IStatusInfo {
    name: string;
    color: string;
    bgColor: string;
}

@Component({
  selector: 'app-avatar-modal',
  templateUrl: './avatar-modal.component.html',
  styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent implements OnInit {
    public isOpened = false;
    public statusList$: BehaviorSubject<IStatusInfo[]> = new BehaviorSubject<IStatusInfo[]>([
        {
            name: 'На линии',
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

    public openDropdown(): void {
        this.isOpened = !this.isOpened;
    }

    public chooseStatus(i: number): void {
        this.userInfo.statusIndex$.next(i);
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
