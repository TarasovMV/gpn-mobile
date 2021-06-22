import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {BehaviorSubject} from 'rxjs';
import {NEW_TASKS, TASKS_IN_PROGRESS} from './mock';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';
import {ModalController, NavController} from '@ionic/angular';
import {ChooseTaskOverlayComponent} from './components/choose-task-overlay/choose-task-overlay.component';
import {TasksService} from '../../../../services/tasks.service';

export interface ITasksItem {
    num: string;
    manufacture: string;
    tare: number;
    test: number;
    checked?: boolean;
    startPoint?: ICoord;
    endPoint?: ICoord;
    routes?: ICoord[];
}

export interface ICoord {
    x: number;
    y: number;
}

@Component({
    selector: 'app-tabs-tasks',
    templateUrl: './tabs-tasks.page.html',
    styleUrls: ['./tabs-tasks.page.scss'],
})
export class TabsTasksPage implements OnInit, IPageTab {
    public route: PageTabType = 'tasks';

    constructor(
        public tabsService: TabsInfoService,
        public modalController: ModalController,
        private navCtrl: NavController
    ) {}

    ngOnInit() {}

    public async openChooseOverlay(): Promise<void> {
        const present = await this.presentModal();
        await present.onDidDismiss();
    }

    public openMap(): void {
        const newTasksList = this.tabsService.newItems$.value;

        if(newTasksList.length !== 0) {
            this.tabsService.currentTask$.next(newTasksList[0]);
            this.navCtrl.navigateRoot('/map').then();
        }
    }

    private async presentModal(): Promise<HTMLIonModalElement> {
        const modal = await this.modalController.create({
            component: ChooseTaskOverlayComponent,
            cssClass: 'choose-task'
        });
        await modal.present();
        return modal;
    }
}
