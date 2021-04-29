import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TabsReadyPage} from './tabs-ready.page';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../@shared/shared.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{path: '', component: TabsReadyPage}]),
        SharedModule,
        AngularSvgIconModule,
    ],
    declarations: [TabsReadyPage]
})
export class TabsReadyPageModule {
}
