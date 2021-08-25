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
import { KeyboardService } from '../../@core/services/keyboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarPopowerComponent } from './components/car-popower/car-popower.component';
import { SimpleModalComponent } from '../../@shared/simple-modal/simple-modal.component';
import { TabsInfoService } from '../../services/tabs/tabs-info.service';
import { SsPush } from 'plugin-sspush';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  @ViewChild('content') private content: ElementRef;
  public loginForm: FormGroup = new FormGroup({
    login: new FormControl('', Validators.required),
    pass: new FormControl('', Validators.required),
  });
  private subscriber$: Subject<null> = new Subject<null>();

  constructor(
    public modalController: ModalController,
    private navCtrl: NavController,
    private keyboardService: KeyboardService,
    private taskService: TabsInfoService
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
    if (this.loginForm.get('login').value.length > 1) {
      this.presentModalCar().then();
      this.taskService.pushInfo.next(2);
      this.taskService.pushInfo.subscribe(async (value) => {
        if (value !== null) {
          await SsPush.resetBadgeCount();
          await SsPush.showTasksNotification({
            countOfTasks: value,
            sound: true,
            vibration: true,
            statusBarIcon: true,
            vibrationLength: 300,
          });
        }
      });
    } else {
      this.presentModalPassword().then();
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
