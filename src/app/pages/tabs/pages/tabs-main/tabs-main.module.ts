import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TabsMainPage} from './tabs-main.page';
import {RouterModule} from '@angular/router';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {SharedModule} from '../../../../@shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: TabsMainPage}]),
        AngularSvgIconModule,
        SharedModule,
    ],
    declarations: [TabsMainPage]
})
export class TabsMainPageModule {
}
