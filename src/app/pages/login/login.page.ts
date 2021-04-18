import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController, PopoverController} from '@ionic/angular';
import {KeyboardService} from '../../@core/services/keyboard.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


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
    private readonly nextUrl: string = 'tabs';

    constructor(
        public popoverController: PopoverController,
        private navCtrl: NavController,
        private keyboardService: KeyboardService,
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

    public submit(e: Event): void {
        this.navCtrl.navigateRoot(this.nextUrl).then();
    }

    private scrollToBottom(): void {
        if (!this.content?.nativeElement) {
            return;
        }
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
}
