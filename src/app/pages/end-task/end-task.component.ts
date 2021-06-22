import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';

@Component({
  selector: 'app-end-task',
  templateUrl: './end-task.component.html',
  styleUrls: ['./end-task.component.scss'],
})
export class EndTaskComponent implements OnInit {

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        public tabsService: TabsInfoService
    ) {}

    public ngOnInit(): void {}

    public back(): void {
        this.navCtrl.back();
    }

    public nextTask(): void {
        const newTasks = this.tabsService.newItems$.value;
        const delivered = this.tabsService.deliveredItems$.value;
        delivered.push(newTasks[0]);
        this.tabsService.deliveredItems$.next(delivered);
        newTasks.shift();
        this.tabsService.newItems$.next(newTasks);
        this.tabsService. currentTask$.next(newTasks[0]);
        this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
    }
}
