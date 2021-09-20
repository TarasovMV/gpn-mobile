import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../../services/user-info.service';
import { ModalController } from '@ionic/angular';
import { TabsInfoService } from '../../../services/tabs/tabs-info.service';
import { VerifyModalComponent } from '../../../pages/nfc-verify/components/verify-modal/verify-modal.component';
import { StatisticModalComponent } from '../statistic-modal/statistic-modal.component';

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

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss().then();
    }

    public async endWorkShift(): Promise<void> {
        await this.dismiss();
        await this.userInfo.endWorkShift();
        await this.openStatisticModal();
    }

    public async openStatisticModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: StatisticModalComponent,
            cssClass: 'custom-modal choose-task',
            backdropDismiss: true,
        });
        await modal.present();
    }

    public changeStatus(id: number): void {
        this.currentStatusId = id;
    }

    ngOnInit(): void {}
}
