import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KeyboardService} from './@core/services/keyboard.service';
import {Platform} from '@ionic/angular';
import {BackgroundMode} from "@ionic-native/background-mode/ngx";

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
        private backgroundMode: BackgroundMode
    ) {
    }

    public ngOnInit(): void {
        this.initializeApp();
    }

    private initializeApp(): void {
        this.platform.ready().then(() => {
            this.keyboardService.setInitSettings(this.platform, this.appWindow).then();
            this.initBackgroundMode();
        });
    }

    private initBackgroundMode(): void {
        this.backgroundMode.on('activate').subscribe(() => {
            console.log('Background mode activated!');
        });
        this.backgroundMode.enable();
    }
}
