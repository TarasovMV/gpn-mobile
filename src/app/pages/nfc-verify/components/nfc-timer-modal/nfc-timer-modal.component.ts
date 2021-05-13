import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Ndef, NFC} from "@ionic-native/nfc/ngx";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-nfc-timer-modal',
    templateUrl: './nfc-timer-modal.component.html',
    styleUrls: ['./nfc-timer-modal.component.scss'],
})
export class NfcTimerModalComponent implements OnInit {

    public nfcLabelAccepted: boolean = false;
    public timerDuration: number = 35;
    public currentTimerValue: number = this.timerDuration;

    private runTimeOut: number;
    private successTimeOut: number;
    private runInterval: number;

    constructor(private nfc: NFC, private ndef: Ndef, private modalCtrl: ModalController, private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.initNfcReader();
        this.initTimer();
    }

    public async close(): Promise<void> {
        this.stopTimeouts();
        await this.modalCtrl.dismiss();
    }

    private initNfcReader(): void {
        let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
        this.nfc.readerMode(flags).subscribe(
            tag => {
                this.nfcLabelAccepted = true;
                this.changeDetectorRef.detectChanges();
                this.successTimeOut = window.setTimeout(async () => {
                    this.stopTimeouts();
                    await this.modalCtrl.dismiss();
                }, 3000);
            },
            async err => {
                console.log(err);
                this.stopTimeouts();
                await this.modalCtrl.dismiss();
            }
        );
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
