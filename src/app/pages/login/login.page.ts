import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    ModalController,
    NavController,
    PopoverController,
} from '@ionic/angular';
import { KeyboardService } from '../../@core/services/platform/keyboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarPopowerComponent } from './components/car-popower/car-popower.component';
import { SimpleModalComponent } from '../../@shared/simple-modal/simple-modal.component';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { SsPush } from 'plugin-sspush';
import { UserInfoService } from '../../services/user-info.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    @ViewChild('content') private content: ElementRef;
    @ViewChild('ripple', { static: true }) public rippleEl: ElementRef;
    public loginForm: FormGroup = new FormGroup({
        userName: new FormControl('Uazov', Validators.required),
        password: new FormControl('pass', Validators.required),
    });
    private subscriber$: Subject<null> = new Subject<null>();

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        private keyboardService: KeyboardService,
        private taskService: TabsInfoService,
        private userService: UserInfoService
    ) {}

    ngOnInit(): void {
        this.keyboardService.keyboardHeight$
            .pipe(takeUntil(this.subscriber$))
            .subscribe(this.scrollToBottom.bind(this));
    }

    ngOnDestroy(): void {
        this.subscriber$.next(null);
        this.subscriber$.complete();
    }

    public async submit(e: Event): Promise<void> {
        // Временная логика
        try {
            await this.userService.auth(this.loginForm.value);
        } catch (err) {
            this.presentModalPassword().then();
        }

        if (this.userService.currentUser) {
            await this.userService.getStatus();
            try {
                await this.userService.getWorkShift();
                this.navCtrl.navigateRoot('/tabs/tabs-main').then();
            } catch (err) {
                this.presentModalCar().then();
            } finally {
                this.taskService.pushInfo.subscribe(async (value) => {
                    if (value !== null) {
                        await SsPush.resetBadgeCount();
                        await SsPush.showDriverTasksNotification({
                            countOfTasks: value,
                            sound: true,
                            vibration: true,
                            statusBarIcon: true,
                            vibrationLength: 300,
                        });
                        await SsPush.showDriverBannerNotification({
                            sound: false,
                            vibration: false,
                            statusBarIcon: true,
                            vibrationLength: 300,
                        });
                    }
                });
            }
        }
    }
    private async presentModalCar() {
        const modal = await this.modalController.create({
            component: CarPopowerComponent,
            cssClass: 'car-modal',
        });
        return await modal.present();
    }

    private async presentModalPassword() {
        const modal = await this.modalController.create({
            component: SimpleModalComponent,
            cssClass: 'simple-modal',
            componentProps: {
                message: 'Неверный пароль',
            },
        });
        return await modal.present();
    }

    private scrollToBottom(): void {
        if (!this.content?.nativeElement) {
            return;
        }
        this.content.nativeElement.scrollTop =
            this.content.nativeElement.scrollHeight;
    }
}
