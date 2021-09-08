import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-status-begin',
    templateUrl: './status-begin.component.html',
    styleUrls: ['./status-begin.component.scss'],
})
export class StatusBeginComponent implements OnInit {
    constructor(
        public userInfo: UserInfoService,
        public modalController: ModalController
    ) {}

    public currentStatusId: number = 3;

    public dismiss(): void {
        this.modalController.dismiss().then();
        this.userInfo.statusIndex$.next(this.currentStatusId);
    }

    public changeStatus(id: number): void {
        this.currentStatusId = id;
    };

    ngOnInit(): void {
    }
}
