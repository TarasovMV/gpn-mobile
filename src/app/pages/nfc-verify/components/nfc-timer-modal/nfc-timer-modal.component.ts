import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Ndef, NFC} from '@ionic-native/nfc/ngx';
import {ModalController, NavController} from '@ionic/angular';
import {NfcService} from '../../../../@core/services/nfc.service';
import {take} from 'rxjs/operators';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

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
        this.tasksToReady();
        await this.modalCtrl.dismiss();
    }

    private initNfcReader(): void {
        this.nfcService.nfcHandler$.pipe(take(1)).subscribe((tag) => {
            this.isNfcAccepted = true;
            this.changeDetectorRef.detectChanges();
            this.successTimeOut = window.setTimeout(async () => {
                this.stopTimeouts();
                this.tasksToReady();
                await this.modalCtrl.dismiss();
            }, 3000);
        });
    }

    private tasksToReady(): void {
        const newTasks = this.tabsService.newItems$.value;
        const selected = this.tabsService.selectedItems$.value;

        if (newTasks.length === 0) {
            selected.push(newTasks[0]);
            this.tabsService.selectedItems$.next(selected);
            newTasks.shift();
            this.tabsService.newItems$.next(newTasks);
            this.tabsService.currentTab$.next(0);

            this.tabsService.deliveredItems$.next(selected.filter(item => !!item));
            this.tabsService.selectedItems$.next([]);
            this.tabsService.currentTab$.next(1);

            this.navCtrl.navigateRoot('/tabs/tabs-ready').then();
        }
        else {
            this.navCtrl.navigateRoot('/end-task');
        }
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
}
