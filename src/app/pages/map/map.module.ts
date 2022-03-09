import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MapPage} from './map.page';
import {RouterModule} from '@angular/router';
import {HammerModule} from '@angular/platform-browser';
import {SharedModule} from '../../@shared/shared.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {MapProgressComponent} from './components/map-progress/map-progress.component';
import {ResolveTaskComponent} from './components/resolve-task/resolve-task.component';
import {MapViewComponent} from './components/map-view/map-view.component';
import {MapDebugComponent} from './components/map-debug/map-debug.component';
import { ProgressTimePipe } from './components/map-progress/progress-time.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HammerModule,
        RouterModule.forChild([{path: '', component: MapPage}]),
        SharedModule,
        AngularSvgIconModule,
    ],
    declarations: [MapPage, MapProgressComponent, ResolveTaskComponent, MapViewComponent, MapDebugComponent, ProgressTimePipe]
})
export class MapPageModule {
}
