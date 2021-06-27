import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {KeyboardService} from './@core/services/keyboard.service';
import {Platform} from '@ionic/angular';
import {ThemeService} from './services/theme.service';
import {DOCUMENT} from '@angular/common';
import {UserInfoService} from './services/user-info.service';
import {Subscription} from 'rxjs';
import {NfcService} from "./@core/services/nfc.service";

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
        private themeService: ThemeService,
        private nfcService: NfcService,
        private userInfo: UserInfoService,
    ) {}

    public ngOnInit(): void {
        this.initializeApp();
        this.themeService.setThemeConfiguratorRoot(this.document).then();

        this.userInfo.statusIndex$.next(1);

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
            setTimeout(() => this.keyboardService.setInitSettings(this.platform, this.appWindow).then());
        });
        this.nfcService.initNfc();
    }
}
