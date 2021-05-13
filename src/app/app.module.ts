import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './@core/core.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {IonicStorageModule} from '@ionic/storage-angular';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AngularSvgIconModule.forRoot(),
        AppRoutingModule, CoreModule,
        HammerModule,
        IonicStorageModule.forRoot()
    ],
    providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
    bootstrap: [AppComponent],
})
export class AppModule {
}
