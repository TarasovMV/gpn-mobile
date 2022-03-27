import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NfcService } from '../../../../@core/services/platform/nfc.service';
import { take } from 'rxjs/operators';
import { TabsInfoService } from '../../../../@core/services/tabs-info.service';
import { DialogModalComponent } from '../../../../@shared/modals/dialog-modal/dialog-modal.component';
import { AcceptModalComponent } from '../../../../@shared/modals/accept-modal/accept-modal.component';

@Component({
    selector: 'app-nfc-timer-modal',
    templateUrl: './nfc-timer-modal.component.html',
    styleUrls: ['./nfc-timer-modal.component.scss'],
})
export class NfcTimerModalComponent implements OnInit {
    public isNfcAccepted = false;
    public timerDuration = 35;
    public currentTimerValue: number = this.timerDuration;

    private runTimeOut: number;
    private successTimeOut: number;
    private runInterval: number;

    constructor(
        private modalCtrl: ModalController,
        private changeDetectorRef: ChangeDetectorRef,
        private nfcService: NfcService,
        private navCtrl: NavController,
        private tabsService: TabsInfoService
    ) {}

    public ngOnInit(): void {
        this.initNfcReader();
        this.initTimer();
    }

    public async close(): Promise<void> {
        this.stopTimeouts();
        if (this.isNfcAccepted) {
            await this.modalCtrl.dismiss();
        } else if (this.tabsService.newItems$.getValue().length !== 0) {
            await this.modalCtrl.dismiss();
            await this.presentModalDialog();
        } else {
            await this.modalCtrl.dismiss();
            await this.presentModalAccept();
        }
    }

    private initNfcReader(): void {
        this.nfcService.nfcHandler$.pipe(take(1)).subscribe((tag) => {
            this.isNfcAccepted = true;
            this.changeDetectorRef.detectChanges();
            this.successTimeOut = window.setTimeout(async () => {
                this.stopTimeouts();
                await this.modalCtrl.dismiss();
                if (this.tabsService.newItems$.getValue().length !== 0) {
                    await this.tasksToReady();
                } else {
                    await this.presentModalAccept();
                }
            }, 3000);
        });
    }

    private async tasksToReady(): Promise<void> {
        await this.navCtrl.navigateRoot('/end-task');
    }

    private initTimer(): void {
        this.runTimeOut = window.setTimeout(async () => {
            this.stopTimeouts();
            await this.modalCtrl.dismiss();
        }, this.timerDuration * 1000);
        this.runInterval = window.setInterval(() => {
            this.currentTimerValue--;
        }, 1000);
    }

    private stopTimeouts(): void {
        window.clearTimeout(this.runTimeOut);
        window.clearInterval(this.runInterval);
        window.clearTimeout(this.successTimeOut);
    }

    private async presentModalDialog() {
        const modal = await this.modalCtrl.create({
            component: DialogModalComponent,
            cssClass: 'custom-modal resolve-modal',
            componentProps: {
                message: 'Метка не отсканирована, подтвердите точку отбора',
            },
        });
        return await modal.present();
    }

    private async presentModalAccept() {
        const modal = await this.modalCtrl.create({
            component: AcceptModalComponent,
            cssClass: 'custom-modal choose-status ',
        });
        return await modal.present();
    }
}
