import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CarPopowerComponent } from './components/car-popower/car-popower.component';
import { SharedModule } from '../../@shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        IonicModule,
        AngularSvgIconModule,
        RouterModule.forChild([{ path: '', component: LoginPage }]),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [LoginPage, CarPopowerComponent],
})
export class LoginPageModule {}
