import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../../../services/tabs/tabs-info.service';
import { ICoord } from '../../../tabs/pages/tabs-tasks/tabs-tasks.page';

@Component({
    selector: 'app-resolve-task',
    templateUrl: './resolve-task.component.html',
    styleUrls: ['./resolve-task.component.scss'],
})
export class ResolveTaskComponent implements OnInit {
    @Input() type: 'endAll' | 'endOne' | 'new';
    @Input() coord: ICoord;
    constructor(
        public modalController: ModalController,
        public tabsService: TabsInfoService,
        private navCtrl: NavController
    ) {}

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async accept(): Promise<void> {
        if (this.type === 'endAll'){
            await this.navCtrl.navigateRoot('/tabs/tabs-ready');
        } else {
            await this.navCtrl.navigateRoot('/nfc');
        }
        await this.dismiss();
    }

    ngOnInit() {}
}
