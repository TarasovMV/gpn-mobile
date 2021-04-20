import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AvatarModalComponent} from './avatar-modal/avatar-modal.component';

@NgModule({
    declarations: [HeaderComponent, AvatarModalComponent],
    exports: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule
    ]
})
export class SharedModule { }
