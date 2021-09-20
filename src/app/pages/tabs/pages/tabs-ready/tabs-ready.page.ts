import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { IPageTab, PageTabType } from '../../tabs.page';
import { BehaviorSubject } from 'rxjs';
import { DELIVERED, SELECTED } from './mock';
import {
    GestureController,
    ModalController,
    NavController,
} from '@ionic/angular';
import { TabsInfoService } from '../../../../services/tabs/tabs-info.service';
import { NfcTimerModalComponent } from '../../../nfc-verify/components/nfc-timer-modal/nfc-timer-modal.component';

export interface IDeliveryItems {
    num: string;
    manufacture: string;
}

@Component({
    selector: 'app-tabs-ready',
    templateUrl: './tabs-ready.page.html',
    styleUrls: ['./tabs-ready.page.scss'],
})
export class TabsReadyPage implements OnInit, IPageTab, AfterViewInit {
    @ViewChild('content') containerElement: ElementRef;

    public transformPage: number;
    public transformPageList: number[] = [0, 100];
    public swipeTransition: number = 0.5;

    public route: PageTabType = 'ready';
    public tabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([
        'в машине',
        'завершено',
    ]);
    constructor(
        private navCtrl: NavController,
        public tabsService: TabsInfoService,
        public modalCtrl: ModalController,
        private gestureCtrl: GestureController,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.calculateFinalTransform();
    }

    ngAfterViewInit() {
        this.useTinderSwipe(this.containerElement);
    }

    public changeTab(i): void {
        this.tabsService.currentTab$.next(i);
        this.calculateFinalTransform();
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: NfcTimerModalComponent,
            cssClass: 'nfc-timer-modal',
            backdropDismiss: true,
        });
        await modal.present();
    }

    public async toNfc(): Promise<void> {
        if (!this.tabsService.newItems$.value.length) {
            await this.openModal();
        }
    }

    private useTinderSwipe(card: ElementRef): void {
        if (!card?.nativeElement) {
            return;
        }

        const screenWidth = card?.nativeElement.offsetWidth;

        const gesture = this.gestureCtrl.create({
            el: card.nativeElement,
            gestureName: 'tinder-swipe',
            onStart: (e) => {
                this.swipeTransition = 0;
            },
            onMove: (e) => {
                const tabIdx = this.tabsService.currentTab$.getValue();
                this.transformPage =
                    this.transformPageList[tabIdx] -
                    (e.deltaX / screenWidth) * 100;
                this.cdRef.detectChanges();
            },
            onEnd: (e) => {
                this.swipeTransition = 0.4;
                if (e.deltaX > screenWidth / 3) {
                    this.changeTab(0);
                } else if (e.deltaX < -screenWidth / 3) {
                    this.changeTab(1);
                } else {
                    const tabIdx = this.tabsService.currentTab$.getValue();
                    this.changeTab(tabIdx);
                }
                this.cdRef.detectChanges();
                this.swipeTransition = 0.5;
            },
        });
        gesture.enable(true);
    }

    private calculateFinalTransform(): void {
        const tabIdx = this.tabsService.currentTab$.getValue();
        this.transformPage = this.transformPageList[tabIdx];
    }
}
