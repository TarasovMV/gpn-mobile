import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {TabsInfoService} from '../../../../../../services/tabs/tabs-info.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ITasksItem} from '../../tabs-tasks.page';

@Component({
  selector: 'app-choose-task-overlay',
  templateUrl: './choose-task-overlay.component.html',
  styleUrls: ['./choose-task-overlay.component.scss'],
})
export class ChooseTaskOverlayComponent implements OnInit {
    taskList$: BehaviorSubject<ITasksItem[]> = new BehaviorSubject<ITasksItem[]>([]);
    private subscription: Subscription;

    constructor(
        public modalController: ModalController,
        public tabsService: TabsInfoService,
        private navCtrl: NavController,
    ) { }

    ngOnInit() {
        this.subscription = this.tabsService.newItems$.subscribe(val => {
            const arr: ITasksItem[] = [];
            val.forEach(item => {
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

    public accept(): void {
        this.dismiss();
        const newTasks = this.taskList$.getValue().filter(item => !item.checked);
        const inProgressTasks = this.taskList$.getValue().filter(item => item.checked);
        this.tabsService.newItems$.next(newTasks);
        this.tabsService.inProgressItems$.next([...inProgressTasks, ...this.tabsService.inProgressItems$.getValue()]);
        this.navCtrl.navigateRoot('/nfc').then();
    }
}
