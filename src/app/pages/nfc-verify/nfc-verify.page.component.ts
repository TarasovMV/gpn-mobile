import {Component, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {TasksService} from '../../services/tasks.service';
import {ITasksItem} from '../tabs/pages/tabs-tasks/tabs-tasks.page';
import {VerifyModalComponent} from './components/verify-modal/verify-modal.component';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';

@Component({
    selector: 'app-nfc-verify.page',
    templateUrl: './nfc-verify.page.component.html',
    styleUrls: ['./nfc-verify.page.component.scss'],
})
export class NfcVerifyPage implements OnInit {

    public currentTask: ITasksItem = null;

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private tabsService: TabsInfoService
    ) {
    }

    ngOnInit(): void {
        this.tabsService.inProgressItems$.subscribe(val => {
            this.currentTask = val[0];
        });
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({component: VerifyModalComponent, cssClass: 'nfc-verify-modal'});
        await modal.present();
    }

    public enableNfc(): void {
        this.openModal().then();
    }

    public back(): void {
        this.navCtrl.back();
    }
}
