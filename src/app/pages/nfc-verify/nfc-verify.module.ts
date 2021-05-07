import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NfcVerifyPage} from "./nfc-verify.page";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../@shared/shared.module";
import {AngularSvgIconModule} from "angular-svg-icon";
import {SplitNumberSignPipe} from "./pipes/split-number-sign.pipe";
import {VerifyModalComponent} from "./components/verify-modal/verify-modal.component";
import {NfcTimerModalComponent} from "./components/nfc-timer-modal/nfc-timer-modal.component";
import {RoundProgressModule, RoundprogressModule} from "angular-svg-round-progressbar";
import {Ndef, NFC} from "@ionic-native/nfc/ngx";


@NgModule({
    declarations: [NfcVerifyPage, SplitNumberSignPipe, VerifyModalComponent, NfcTimerModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: NfcVerifyPage}]),
        SharedModule,
        AngularSvgIconModule,
        RoundprogressModule,
        RoundProgressModule
    ],
    providers: [NFC, Ndef]
})
export class NfcVerifyModule {
}
