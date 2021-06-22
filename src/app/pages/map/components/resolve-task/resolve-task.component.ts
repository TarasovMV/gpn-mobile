import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

@Component({
  selector: 'app-resolve-task',
  templateUrl: './resolve-task.component.html',
  styleUrls: ['./resolve-task.component.scss'],
})
export class ResolveTaskComponent implements OnInit {
    constructor(
        public modalController: ModalController,
        public tabsService: TabsInfoService,
        private navCtrl: NavController
    ) { }

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss();
    }

    public async accept(): Promise<void> {
        await this.dismiss();
        this.navCtrl.navigateRoot('/nfc').then();
        this.tabsService.currentTab$.next(1);
    }

    ngOnInit() {}
}
