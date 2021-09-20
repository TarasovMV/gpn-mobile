import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { KeyboardService } from './@core/services/platform/keyboard.service';
import { Platform } from '@ionic/angular';
import { ThemeService } from './services/theme.service';
import { DOCUMENT } from '@angular/common';
import { UserInfoService } from './services/user-info.service';
import { Subscription } from 'rxjs';
import { NfcService } from './@core/services/platform/nfc.service';
import { TabsInfoService } from './services/tabs/tabs-info.service';
import { GeoProjection, toFlat, toWGS } from 'as-geo-projection';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('appWindow', { static: true }) private appWindow: ElementRef;
    private subscription: Subscription;
    private timeOut: any;
    constructor(
        private keyboardService: KeyboardService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: Document,
        private themeService: ThemeService,
        private nfcService: NfcService,
        private userInfo: UserInfoService,
        private tasksService: TabsInfoService
    ) {}

    public ngOnInit(): void {
        this.initializeApp();
        this.themeService.setThemeConfiguratorRoot(this.document).then();

        this.subscription = this.userInfo.statusId$.subscribe((value) => {
            const time = 25 * 60000;
            if (value !== 2) {
                clearTimeout(this.timeOut);
                this.timeOut = null;
            } else {
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
            setTimeout(() =>
                this.keyboardService
                    .setInitSettings(this.platform, this.appWindow)
                    .then()
            );
            setTimeout(() => this.tasksService.cancelData(), 1000);
        });
        this.nfcService.initNfc();
    }
}
