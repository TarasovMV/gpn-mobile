import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MapPage} from './map.page';
import {RouterModule} from '@angular/router';
import {HammerModule} from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HammerModule,
        RouterModule.forChild([{path: '', component: MapPage}]),
    ],
    declarations: [MapPage]
})
export class MapPageModule {
}
