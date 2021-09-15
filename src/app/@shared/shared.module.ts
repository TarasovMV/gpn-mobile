import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AvatarModalComponent } from './avatar-modal/avatar-modal.component';
import { StepProgressBarComponent } from './step-progress-bar/step-progress-bar.component';
import { IonicModule } from '@ionic/angular';
import { SimpleModalComponent } from './simple-modal/simple-modal.component';
import { ActivityModalComponent } from './activity-modal/activity-modal.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { UserInfoComponent } from './avatar-modal/components/user-info/user-info.component';
import { TeachingComponent } from './avatar-modal/components/teaching/teaching.component';
import { SupportComponent } from './avatar-modal/components/support/support.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { StatusDropdownComponent } from './status-dropdown/status-dropdown.component';
import { StatusBeginComponent } from './status-begin/status-begin.component';
import { StatusFilterPipe } from './status-begin/pipe/status-filter.pipe';
import { StatusCurrentComponent } from './status-current/status-current.component';
import { RippleDirective } from '../@core/directives/ripple.directive';
import { ButtonComponent } from './button/button.component';
import { DialogModalComponent } from './dialog-modal/dialog-modal.component';
import { StatisticModalComponent } from './statistic-modal/statistic-modal.component';
import {NfcTimerModalComponent} from "../pages/nfc-verify/components/nfc-timer-modal/nfc-timer-modal.component";

@NgModule({
    declarations: [
        HeaderComponent,
        AvatarModalComponent,
        StepProgressBarComponent,
        SimpleModalComponent,
        ActivityModalComponent,
        MapModalComponent,
        UserInfoComponent,
        TeachingComponent,
        SupportComponent,
        DropdownComponent,
        StatusDropdownComponent,
        StatusBeginComponent,
        StatusFilterPipe,
        StatusCurrentComponent,
        RippleDirective,
        ButtonComponent,
        DialogModalComponent,
        StatisticModalComponent,
        NfcTimerModalComponent
    ],
    exports: [
        HeaderComponent,
        StepProgressBarComponent,
        SimpleModalComponent,
        ActivityModalComponent,
        MapModalComponent,
        StatusBeginComponent,
        StatusCurrentComponent,
        RippleDirective,
        ButtonComponent,
        DialogModalComponent,
        StatisticModalComponent,
        NfcTimerModalComponent
    ],
    imports: [CommonModule, AngularSvgIconModule, IonicModule],
})
export class SharedModule {}
