import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../../@core/services/tabs-info.service';

@Component({
    selector: 'app-accept-modal',
    templateUrl: './accept-modal.component.html',
    styleUrls: ['./accept-modal.component.scss'],
})
export class AcceptModalComponent implements OnInit {
    constructor(
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public tabsService: TabsInfoService
    ) {}

    public async close(): Promise<void> {
        await this.modalCtrl.dismiss();
    }

    public async redirectToReadyTub(): Promise<void> {
        this.tabsService.currentTab$.next(1);
        await this.tabsService.endTasks();
        await this.close();
        await this.navCtrl.navigateRoot('/tabs/tabs-ready');
    }

    ngOnInit() {}
}
