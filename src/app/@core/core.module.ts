import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { Ndef, NFC } from '@ionic-native/nfc/ngx';
import {HTTP_GLOBAL} from './tokens';

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [
        {
            provide: HTTP_GLOBAL,
            useExisting: HttpClient,
            deps: [HttpClientModule],
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
        NFC,
        Ndef,
    ],
})
export class CoreModule {}
