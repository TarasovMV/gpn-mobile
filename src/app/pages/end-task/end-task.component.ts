import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { CancelTaskComponent } from '../../@shared/cancel-task/cancel-task.component';

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

    public async nextTask(): Promise<void> {
        await this.tabsService.goToNextTask();

        if (!!this.tabsService.newItems$.getValue().length) {
            await this.navCtrl.navigateRoot('/tabs/tabs-tasks');
        } else {
            await this.navCtrl.navigateRoot('/map');
        }
    }

    public async cancel(): Promise<void> {
        await this.presentModal();
    }

    private async presentModal() {
        const modal = await this.modalCtrl.create({
            component: CancelTaskComponent,
            cssClass: 'avatar-modal',
            showBackdrop: false,
        });
        return await modal.present();
    }
}
