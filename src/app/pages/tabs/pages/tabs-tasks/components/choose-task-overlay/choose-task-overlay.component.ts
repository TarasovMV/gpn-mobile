import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../../../../../@core/services/tabs-info.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ITask } from '../../../../../../@core/model/task.model';

@Component({
    selector: 'app-choose-task-overlay',
    templateUrl: './choose-task-overlay.component.html',
    styleUrls: ['./choose-task-overlay.component.scss'],
})
export class ChooseTaskOverlayComponent implements OnInit {
    taskList$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);
    private subscription: Subscription;

    constructor(
        public modalController: ModalController,
        public tabsService: TabsInfoService,
        private navCtrl: NavController
    ) {}

    ngOnInit() {
        this.subscription = this.tabsService.newItems$.subscribe((val) => {
            const arr: ITask[] = [];
            val.forEach((item) => {
                item.checked = true;
                arr.push(item);
            });
            this.taskList$.next(arr);
        });
    }

    public dismiss(): void {
        this.modalController.dismiss().then();
        this.subscription.unsubscribe();
    }

    public async accept(): Promise<void> {
        await this.navCtrl.navigateRoot('/nfc').then();
        await this.dismiss();
    }
}
