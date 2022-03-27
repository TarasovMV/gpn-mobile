import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../../@core/services/user-info.service';
import { ModalController } from '@ionic/angular';
import {TabsInfoService} from "../../../@core/services/tabs-info.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
    selector: 'app-status-begin',
    templateUrl: './status-begin.component.html',
    styleUrls: ['./status-begin.component.scss'],
})
export class StatusBeginComponent implements OnInit {
    public disableStatusBtn$: Observable<boolean> = this.taskService.currentTask$.pipe(map((task => !!task)));
    constructor(
        public userInfo: UserInfoService,
        public modalController: ModalController,
        public taskService: TabsInfoService,
    ) {}

    public currentStatusId: number = 3;

    public async dismiss(): Promise<void> {
        this.userInfo.statusId$.next(this.currentStatusId);
        await this.userInfo.setWorkShift();
        await this.modalController.dismiss();
    }

    public changeStatus(id: number): void {
        this.currentStatusId = id;
    };

    ngOnInit(): void {
    }
}
