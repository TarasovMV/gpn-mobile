import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';;
import {NfcVerifyPage} from "./nfc-verify.page.component";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../@shared/shared.module";
import {AngularSvgIconModule} from "angular-svg-icon";
import {SplitNumberSignPipe} from "./pipes/split-number-sign.pipe";


@NgModule({
  declarations: [NfcVerifyPage, SplitNumberSignPipe],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: NfcVerifyPage}]),
        SharedModule,
        AngularSvgIconModule,
    ]
})
export class NfcVerifyModule { }
