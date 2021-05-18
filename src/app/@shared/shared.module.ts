import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AvatarModalComponent} from './avatar-modal/avatar-modal.component';
import {StepProgressBarComponent} from './step-progress-bar/step-progress-bar.component';
import {IonicModule} from '@ionic/angular';
import {SimpleModalComponent} from './simple-modal/simple-modal.component';
import {ActivityModalComponent} from './activity-modal/activity-modal.component';
import {MapModalComponent} from './map-modal/map-modal.component';


@NgModule({
    declarations: [
        HeaderComponent,
        AvatarModalComponent,
        StepProgressBarComponent,
        SimpleModalComponent,
        ActivityModalComponent,
        MapModalComponent
    ],
    exports: [
        HeaderComponent,
        StepProgressBarComponent,
        SimpleModalComponent,
        ActivityModalComponent,
        MapModalComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule,
        IonicModule
    ]
})
export class SharedModule { }
