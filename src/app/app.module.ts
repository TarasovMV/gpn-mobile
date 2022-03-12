import {inject, NgModule} from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './@core/core.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GpsService} from './@core/services/platform/gps.service';
import {environment} from '../environments/environment';
import {FakeGpsService} from './@core/services/platform/fake-gps.service';
import {GPS} from './@core/tokens';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpCachingInterceptor} from './@core/interceptors/http-caching.interceptor';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AngularSvgIconModule.forRoot(),
        AppRoutingModule,
        CoreModule,
        HammerModule,
        IonicStorageModule.forRoot(),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCachingInterceptor,
            multi: true,
        },
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        {
            provide: GPS,
            useClass: environment.fakeGps ? FakeGpsService : GpsService,
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
