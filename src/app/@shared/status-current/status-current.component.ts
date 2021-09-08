import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
import { ModalController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';

@Component({
    selector: 'app-status-current',
    templateUrl: './status-current.component.html',
    styleUrls: ['./status-current.component.scss'],
})
export class StatusCurrentComponent implements OnInit {
    constructor(
        public userInfo: UserInfoService,
        public taskInfo: TabsInfoService,
        public modalController: ModalController
    ) {}

    public currentStatusId: number = 1;

    public dismiss(): void {
        this.modalController.dismiss().then();
    }

    public changeStatus(id: number): void {
        this.currentStatusId = id;
    }

    ngOnInit(): void {}
}
