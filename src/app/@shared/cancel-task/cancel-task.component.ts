import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { ISelectOption } from '../select/select.interfaces';
import {EStatus, UserInfoService} from "../../services/user-info.service";

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
        private userInfo: UserInfoService,
        public modalController: ModalController,
        public navCtrl: NavController
    ) {}

    async ngOnInit() {
        await this.tabsService.getReasons();
        this.chosenReasonId = this.tabsService.reasonsList$.getValue()[0].id;
    }

    public get isDisableSend(): boolean {
        return !(
            this.chosenReasonId !== 6 || !!this.comment.trim()
        );
    }

    public changeDropdownValue(option: ISelectOption) {
        this.chosenReasonId = option?.id;
    }

    public async dismiss(): Promise<void> {
        this.modalController.dismiss().then();
    }

    public async cancelTask(): Promise<void> {
        const taskId = this.tabsService.currentTask$.getValue().id;
        const res = await this.tabsService.failTask(
            taskId,
            this.chosenReasonId,
            this.comment
        );

        if (this.tabsService.newItems$.getValue().length === 0) {
            this.tabsService.currentTask$.next(this.tabsService.elkTask);
            await this.dismiss();
            await this.navCtrl.navigateRoot('map');
        } else {
            await this.dismiss();
            await this.navCtrl.navigateRoot('tabs/tabs-tasks');
        }
    }
}
