import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { ISelectOption } from '../select/select.interfaces';

@Component({
    selector: 'app-cancel-task',
    templateUrl: './cancel-task.component.html',
    styleUrls: ['./cancel-task.component.scss'],
})
export class CancelTaskComponent implements OnInit {
    public chosenReasonId: number;
    public comment: string = '';
    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController,
        public navCtrl: NavController
    ) {}

    async ngOnInit() {
        await this.tabsService.getReasons();
        this.chosenReasonId = this.tabsService.reasonsList$.getValue()[0].id;
    }

    public changeDropdownValue(option: ISelectOption) {
        this.chosenReasonId = option?.id;
    }

    public async dismiss(): Promise<void> {
        this.modalController.dismiss().then();
    }

    public async cancelTask(): Promise<void> {
        const taskId = this.tabsService.currentTask$.getValue().id;
        const res = await this.tabsService.declineTask(
            taskId,
            this.chosenReasonId
        );
        await this.dismiss();
        await this.navCtrl.navigateRoot('tabs/tabs-tasks');
    }
}
