import {Component, OnDestroy, OnInit} from '@angular/core';
import {EStatus, UserInfoService} from '../../../services/user-info.service';
import { ModalController } from '@ionic/angular';
import { TabsInfoService } from '../../../services/tabs/tabs-info.service';
import { VerifyModalComponent } from '../../../pages/nfc-verify/components/verify-modal/verify-modal.component';
import { StatisticModalComponent } from '../statistic-modal/statistic-modal.component';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-status-current',
    templateUrl: './status-current.component.html',
    styleUrls: ['./status-current.component.scss'],
})
export class StatusCurrentComponent implements OnInit, OnDestroy {
    public disableStatusBtn$: Observable<boolean> = this.taskInfo.currentTask$.pipe(map((task => !!task)));
    public forbiddenStatus$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([5]);
    statusCheckSubscription: Subscription = new Subscription();
    constructor(
        public userInfo: UserInfoService,
        public taskInfo: TabsInfoService,
        public modalController: ModalController
    ) {}

    public currentStatusId = 1;

    public async dismiss(): Promise<void> {
        await this.modalController.dismiss().then();
    }

    public async endWorkShift(): Promise<void> {
       if (!this.taskInfo.newItems$.getValue().length ) {
           await this.dismiss();
           await this.userInfo.endWorkShift();
           await this.openStatisticModal();
       }
       else {
           await this.taskInfo.disabledBtn('Вы выполнили не все задачи');
       }
    }

    public async openStatisticModal(): Promise<void> {
        const modal = await this.modalController.create({
            component: StatisticModalComponent,
            cssClass: 'custom-modal choose-status',
            backdropDismiss: true,
        });
        await modal.present();
    }

    public changeStatus(id: number): void {
        this.currentStatusId = id;
    }

    ngOnInit(): void {
        this.statusCheckSubscription = this.taskInfo.currentTask$.subscribe(item => {
            if (!item) {
                let statusList = this.forbiddenStatus$.getValue();
                statusList.push(EStatus.busy);
                statusList = Array.from(new Set(statusList));

                this.forbiddenStatus$.next(statusList);
            }
        });
    }

    ngOnDestroy(): void {
        this.statusCheckSubscription.unsubscribe()
    }
}
