import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { VerifyModalComponent } from './components/verify-modal/verify-modal.component';
import {CancelTaskComponent} from "../../@shared/cancel-task/cancel-task.component";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SimpleModalComponent} from "../../@shared/modals/simple-modal/simple-modal.component";
import {SimpleDialogModalComponent} from "../../@shared/modals/simple-dialog-modal/simple-dialog-modal.component";

@Component({
    selector: 'app-nfc-verify.page',
    templateUrl: './nfc-verify.page.html',
    styleUrls: ['./nfc-verify.page.scss'],
})
export class NfcVerifyPage implements OnInit {
    public taresCount$: Observable<number> = this.tabsService.currentTask$.pipe(
        map(x => x.tares.map(t => t.count).reduce((acc, next) => acc + next, 0)),
    );
    public probesCount$: Observable<number> = this.tabsService.currentTask$.pipe(
        map(x => x.probes.map(t => t.count).reduce((acc, next) => acc + next, 0)),
    );

    constructor(
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        public tabsService: TabsInfoService
    ) {}

    public ngOnInit(): void {
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: VerifyModalComponent,
            cssClass: 'custom-modal nfc-verify-modal',
            backdropDismiss: true,
        });
        await modal.present();
    }

    public async enableNfc(): Promise<void> {
        await this.openModal();
    }

    public back(): void {
        this.navCtrl.back();
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
