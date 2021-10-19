import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfcVerifyPage } from './nfc-verify.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SplitNumberSignPipe } from './pipes/split-number-sign.pipe';
import { VerifyModalComponent } from './components/verify-modal/verify-modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [NfcVerifyPage, SplitNumberSignPipe, VerifyModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: NfcVerifyPage}]),
        SharedModule,
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class NfcVerifyModule {}
