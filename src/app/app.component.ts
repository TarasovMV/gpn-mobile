import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {KeyboardService} from './@core/services/keyboard.service';
import {Platform} from '@ionic/angular';
import {ThemeServiceService} from './services/theme-service.service';
import {DOCUMENT} from '@angular/common';
import {Ndef, NdefEvent, NFC} from "@ionic-native/nfc/ngx";
import {Capacitor} from "@capacitor/core";
import {NDefIntent} from "capacitor-ndef-intent";
import {Observable} from "rxjs";
import {NfcService} from "./services/nfc/nfc.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChild('appWindow', {static: true}) private appWindow: ElementRef;

    constructor(
        private keyboardService: KeyboardService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: Document,
        private themeService: ThemeServiceService,
        private nfc : NFC,
        private ndef: Ndef,
        private nfcService: NfcService
    ) {}

    public ngOnInit(): void {
        this.initializeApp();
        this.themeService.setThemeConfiguratorRoot(this.document);
    }

    private initializeApp(): void {
        this.platform.ready().then(() => {
            this.keyboardService.setInitSettings(this.platform, this.appWindow).then();

            this.nfcService.nfcListener = this.nfc.addNdefFormatableListener();
            this.nfcService.nfcListener.subscribe();
        });

    }
}
