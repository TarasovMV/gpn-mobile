import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import {EStatus, UserInfoService} from '../../../../services/user-info.service';
import {StatusCurrentComponent} from '../../../modals/status-current/status-current.component';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
    @Output() onChangeUser = new EventEmitter<boolean>();
    @Output() onChangeCar = new EventEmitter<boolean>();
    public isOpened = false;
    public forbiddenStatus$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([5]);
    public disableStatusBtn$: Observable<boolean> = this.taskService.currentTask$.pipe(map((task => !!task)));
    statusCheckSubscription: Subscription = new Subscription();
    constructor(
        private navCtrl: NavController,
        public userInfo: UserInfoService,
        public taskService: TabsInfoService,
        public modalController: ModalController
    ) {}

    public changeUser(): void {
        this.onChangeUser.emit(true);
    }

    public async changeStatus(id: number): Promise<void> {
        this.userInfo.changeStatus(id);
        if (id === 1) {
            await this.presentModalChooseStatus();
        }
    }

    public openDropdown(): void {
        this.isOpened = !this.isOpened;
    }

    public changeCar(): void {
        this.onChangeCar.emit(true);
    }

    ngOnInit() {
        this.statusCheckSubscription = this.taskService.currentTask$.subscribe(item => {
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

    private async presentModalChooseStatus() {
        const modal = await this.modalController.create({
            component: StatusCurrentComponent,
            cssClass: 'custom-modal choose-status current-status',
        });
        return await modal.present();
    }
}
