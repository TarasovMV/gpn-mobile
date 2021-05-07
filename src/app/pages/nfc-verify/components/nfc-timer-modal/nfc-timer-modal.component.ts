import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Ndef, NFC} from "@ionic-native/nfc/ngx";
import {ModalController} from "@ionic/angular";
import {VerifyModalComponent} from "../verify-modal/verify-modal.component";

@Component({
    selector: 'app-nfc-timer-modal',
    templateUrl: './nfc-timer-modal.component.html',
    styleUrls: ['./nfc-timer-modal.component.scss'],
})
export class NfcTimerModalComponent implements OnInit {

    public nfcLabelAccepted: boolean = false;

    constructor(private nfc: NFC, private ndef: Ndef, private modalCtrl: ModalController, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
        this.nfc.readerMode(flags).subscribe(
            tag => {
                this.nfcLabelAccepted = true;
                this.changeDetectorRef.detectChanges();
                setTimeout(async () => {
                    await this.modalCtrl.dismiss();
                    this.nfcLabelAccepted = false;
                    const modal = await this.modalCtrl.create({
                        component: VerifyModalComponent,
                        cssClass: 'nfc-verify-modal'
                    });
                    await modal.present();
                }, 600);
            },
            async err => {
                console.log(err);
                await this.modalCtrl.dismiss();
            }
        );
    }

}
