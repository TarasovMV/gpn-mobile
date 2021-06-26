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
        const selected = this.tabsService.selectedItems$.value;
        selected.push(newTasks[0]);
        this.tabsService.selectedItems$.next(selected);
        newTasks.shift();
        this.tabsService.newItems$.next(newTasks);
        this.tabsService.currentTab$.next(0);
        if (newTasks.length === 0) {
            this.tabsService.deliveredItems$.next(selected.filter(item => !!item));
            this.tabsService.selectedItems$.next([]);
            this.tabsService.currentTab$.next(1);

            this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
            return;
        }

        if (newTasks.filter(item => !item.specialProps && !item?.specialProps?.includes('elk')).length === 0) {
            this.tabsService.currentTask$.next(newTasks[0]);
            newTasks.shift();
            this.tabsService.newItems$.next(newTasks);
            this.navCtrl.navigateRoot('/map').then();
        }
        else {
            this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
        }
    }
}
