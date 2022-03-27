import {Component, OnInit} from '@angular/core';
import {IPageTab, PageTabType} from '../../tabs.page';
import {TabsInfoService} from '../../../../@core/services/tabs-info.service';
import {ModalController, NavController} from '@ionic/angular';
import {ChooseTaskOverlayComponent} from './components/choose-task-overlay/choose-task-overlay.component';
import {EStatus, UserInfoService} from '../../../../@core/services/user-info.service';


@Component({
    selector: 'app-tabs-tasks',
    templateUrl: './tabs-tasks.page.html',
    styleUrls: ['./tabs-tasks.page.scss'],
})
export class TabsTasksPage implements OnInit, IPageTab {
    public route: PageTabType = 'tasks';

    constructor(
        public tabsService: TabsInfoService,
        private userInfo: UserInfoService,
        public modalController: ModalController,
        private navCtrl: NavController
    ) {}

    ngOnInit(): void {}

    public openMap(): void {
        const newTasksList = this.tabsService.newItems$.getValue();

        if(!!newTasksList?.length) {
            this.userInfo.changeStatus(EStatus.busy);
            this.navCtrl.navigateRoot('/map').then();
        }

        if (this.tabsService.currentTask$.getValue()?.id === null) {
            this.navCtrl.navigateRoot('/map').then();
        }
    }

    private async presentModal(): Promise<HTMLIonModalElement> {
        const modal = await this.modalController.create({
            component: ChooseTaskOverlayComponent,
            cssClass: 'custom-modal'
        });
        await modal.present();
        return modal;
    }
}
