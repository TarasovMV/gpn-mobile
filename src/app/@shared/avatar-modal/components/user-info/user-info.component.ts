import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UserInfoService } from '../../../../services/user-info.service';
import { StatusBeginComponent } from '../../../status-begin/status-begin.component';
import {StatusCurrentComponent} from "../../../status-current/status-current.component";

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
    @Output() onChangeUser = new EventEmitter<boolean>();
    @Output() onChangeCar = new EventEmitter<boolean>();
    public isOpened = false;
    constructor(
        private navCtrl: NavController,
        public userInfo: UserInfoService,
        public modalController: ModalController
    ) {}

    public changeUser(): void {
        this.onChangeUser.emit(true);
    }

    public async changeStatus(id: number): Promise<void> {
        this.userInfo.statusId$.next(id);
        if (id === 1) {
            await this.presentModalChooseStatus();
        }
    }

    public openDropdown(): void {
        this.isOpened = !this.isOpened;
    }

    public changeCar(): void {
        this.onChangeCar.emit(true);
    }

    ngOnInit() {}

    private async presentModalChooseStatus() {
        const modal = await this.modalController.create({
            component: StatusCurrentComponent,
            cssClass: 'current-status',
        });
        return await modal.present();
    }
}
