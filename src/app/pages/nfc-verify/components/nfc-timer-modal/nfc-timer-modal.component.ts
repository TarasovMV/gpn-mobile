import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Ndef, NFC} from '@ionic-native/nfc/ngx';
import {ModalController, NavController} from '@ionic/angular';
import {NfcService} from '../../../../@core/services/nfc.service';
import {take} from 'rxjs/operators';

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
    ) {}

    public ngOnInit(): void {
        this.initNfcReader();
        this.initTimer();
    }

    public async close(): Promise<void> {
        this.stopTimeouts();
        await this.modalCtrl.dismiss();
        await this.navCtrl.navigateRoot('/end-task');
    }

    private initNfcReader(): void {
        this.nfcService.nfcHandler$.pipe(take(1)).subscribe((tag) => {
            this.isNfcAccepted = true;
            this.changeDetectorRef.detectChanges();
            this.successTimeOut = window.setTimeout(async () => {
                this.stopTimeouts();
                await this.modalCtrl.dismiss();
            }, 3000);
        });
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
