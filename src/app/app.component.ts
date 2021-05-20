import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {KeyboardService} from './@core/services/keyboard.service';
import {Platform} from '@ionic/angular';
import {ThemeServiceService} from './services/theme-service.service';
import {DOCUMENT} from '@angular/common';
import {UserInfoService} from './services/user-info.service';
import {Subscription} from 'rxjs';
import {NFC} from '@ionic-native/nfc/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('appWindow', {static: true}) private appWindow: ElementRef;
    private subscription: Subscription;
    private timeOut: any;
    constructor(
        private keyboardService: KeyboardService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: Document,
        private themeService: ThemeServiceService,
        private userInfo: UserInfoService,
        private nfc: NFC,
    ) {}

    public ngOnInit(): void {
        this.initializeApp();
        this.themeService.setThemeConfiguratorRoot(this.document).then();

        this.subscription = this.userInfo.statusIndex$.subscribe(value => {
            const time = 60000;

            if (value !== 2) {
                clearTimeout(this.timeOut);
                this.timeOut = null;
            }
            else {
                if (!this.timeOut) {
                    this.timeOut = setTimeout(async () => {
                        this.userInfo.openActivityModal().then();
                    }, time);
                }
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeApp(): void {
        this.platform.ready().then(() => {
            this.keyboardService.setInitSettings(this.platform, this.appWindow).then();
        });
        this.initNfc();
    }

    private initNfc(): void {
        // this.nfc.addNdefListener((res) => console.log('success'), () => console.log('error')).subscribe((res) => console.log('res1', JSON.stringify(res)));
        this.nfc.addNdefFormatableListener((res) => console.log('success'), () => console.log('error')).subscribe((res) => console.log('res', JSON.stringify(res)));
        const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V | this.nfc.FLAG_READER_SKIP_NDEF_CHECK;
        this.nfc.readerMode(flags).subscribe(
            tag => console.log(JSON.stringify(tag)),
            err => console.log('Error reading tag', err)
        );
    }
}
