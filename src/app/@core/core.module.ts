import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {AuthenticationInterceptor} from './interceptors/authentication.interceptor';
import {appConfigInit, AppConfigService} from './services/app-config.service';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor,  multi: true },
        { provide: APP_INITIALIZER, useFactory: appConfigInit, deps: [AppConfigService], multi: true },
    ]
})
export class CoreModule {
}
