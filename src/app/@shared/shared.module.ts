import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AvatarModalComponent} from './avatar-modal/avatar-modal.component';
import {StepProgressBarComponent} from "./step-progress-bar/step-progress-bar.component";
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [HeaderComponent, AvatarModalComponent, StepProgressBarComponent],
    exports: [
        HeaderComponent,
        StepProgressBarComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule,
        IonicModule
    ]
})
export class SharedModule { }
