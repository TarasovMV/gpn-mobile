import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';
import {RouterModule} from '@angular/router';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {CarPopowerComponent} from './components/car-popower/car-popower.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AngularSvgIconModule,
        RouterModule.forChild([{path: '', component: LoginPage}]),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [LoginPage, CarPopowerComponent]
})
export class LoginPageModule {
}
