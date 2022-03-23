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
import { ThemeService } from './@core/services/platform/theme.service';
import { DOCUMENT } from '@angular/common';
import { UserInfoService } from './services/user-info.service';
import {interval, Subscription} from 'rxjs';
import { NfcService } from './@core/services/platform/nfc.service';
import { SplashScreen } from '@capacitor/splash-screen';
import {PreprocessService} from './services/graphs/preprocess.service';
import {TabsInfoService} from './services/tabs/tabs-info.service';
import {GPS} from './@core/tokens';
import {IGpsService} from './@core/model/gps.model';
import {map} from 'rxjs/operators';
import {positionStringify} from './@core/functions/position-stringify.function';
import {CarTrackingService} from './@core/services/car-tracking.service';
import {CurrentTaskTrackingService} from './@core/services/current-task-tracking.service';


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
        private tabsInfoService: TabsInfoService,
        @Inject(GPS) private gpsService: IGpsService,
        private carTracking: CarTrackingService,
        private taskTracking: CurrentTaskTrackingService,

        private preprocess: PreprocessService,
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

        interval(5000).subscribe(() => {
            this.tabsInfoService.getTasks().then();
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeApp(): void {
        this.nfcService.initNfc();
        this.platform.ready().then(() => {
            setTimeout(() => this.keyboardService.setInitSettings(this.platform, this.appWindow).then());
            setTimeout(() => SplashScreen.hide(), 300);
        });
    }
}
