import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { CarPopowerComponent } from '../../pages/login/components/car-popower/car-popower.component';
import { UserInfoService } from '../../services/user-info.service';

@Component({
    selector: 'app-statistic-modal',
    templateUrl: './statistic-modal.component.html',
    styleUrls: ['./statistic-modal.component.scss'],
})
export class StatisticModalComponent implements OnInit {
    constructor(
        public modalCtrl: ModalController,
        public tabsService: TabsInfoService,
        public userInfo: UserInfoService
    ) {}

    public async close(): Promise<void> {
        await this.modalCtrl.dismiss();
        await this.presentCarModal();
    }

    public async presentCarModal(): Promise<void> {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: CarPopowerComponent,
            cssClass: 'car-modal',
        });
        await modal.present();
    }

    public ngOnInit() {}
}
