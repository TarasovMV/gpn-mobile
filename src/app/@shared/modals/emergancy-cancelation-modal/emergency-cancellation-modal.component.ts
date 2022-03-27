import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../../@core/services/tabs-info.service';

@Component({
    selector: 'app-emergency-cancellation-modal',
    templateUrl: './emergency-cancellation-modal.component.html',
    styleUrls: ['./emergency-cancellation-modal.component.scss'],
})
export class EmergencyCancellationModalComponent implements OnInit {
    @Input() message: string;

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        private tabsInfo: TabsInfoService,
    ) {}

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async accept(): Promise<void> {
        await this.tabsInfo.goToNextTask();
        await this.navCtrl.navigateRoot('/tabs/tabs-tasks');
        await this.dismiss();
    }

    ngOnInit() {}
}
