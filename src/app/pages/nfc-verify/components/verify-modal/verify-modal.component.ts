import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NfcTimerModalComponent } from '../nfc-timer-modal/nfc-timer-modal.component';
import { TabsInfoService } from '../../../../services/tabs/tabs-info.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-verify-modal',
    templateUrl: './verify-modal.component.html',
    styleUrls: ['./verify-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyModalComponent implements OnInit, OnDestroy {
    public isValid: boolean = true;
    public form: FormGroup = new FormGroup({
        arr: new FormArray([]),
    });
    public taresCount$: Observable<number> = this.tabsService.currentTask$.pipe(
        map((x) =>
            x.tares.map((t) => t.count).reduce((acc, next) => acc + next, 0)
        )
    );
    public probesCount$: Observable<number> =
        this.tabsService.currentTask$.pipe(
            map((x) =>
                x.probes
                    .map((t) => t.count)
                    .reduce((acc, next) => acc + next, 0)
            )
        );
    private subscription: Subscription[] = [];

    constructor(
        public modalCtrl: ModalController,
        public tabsService: TabsInfoService
    ) {}

    ngOnInit(): void {
        this.subscription.push(
            this.tabsService.currentTask$.subscribe((task) => {
                [...task.tares, ...task.probes].forEach((item) => {
                    const formControl = new FormControl(item.checked);
                    this.formArr.push(formControl);
                    this.isValid = this.isValid && item.checked;
                });
            }),
            this.formArr.valueChanges.subscribe((value) => {
                this.isValid = value.every((item) => item === true);
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.forEach(item => item.unsubscribe());
    }

    public async close(): Promise<void> {
        await this.modalCtrl.dismiss();
    }

    public async openModal(): Promise<void> {
        const modal = await this.modalCtrl.create({
            component: NfcTimerModalComponent,
            cssClass: 'nfc-timer-modal',
            backdropDismiss: true,
        });
        await modal.present();
    }

    public async presentNfcTimerModal(): Promise<void> {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: NfcTimerModalComponent,
            cssClass: 'nfc-timer-modal',
        });
        await modal.present();
    }

    public get formArr(): FormArray {
        return this.form.get('arr') as FormArray;
    }

    public check(value: boolean, idx: number, type: 'probe' | 'tare'): void {
        const currantTask = this.tabsService.currentTask$.getValue();
        idx = type === 'probe' ? currantTask.tares.length + idx : idx;
        this.formArr.controls[idx].setValue(!value);
    }
}
