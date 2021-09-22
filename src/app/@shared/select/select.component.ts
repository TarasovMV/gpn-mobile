import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ISelectOption } from './select.interfaces';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent implements OnInit, ControlValueAccessor {
    @Input() options: ISelectOption[];
    @Input() public set value(val: ISelectOption) {
        this._value = val;
        this.onChange(val);
    }
    @Output() onSelectValue: EventEmitter<ISelectOption> =
        new EventEmitter<ISelectOption>();
    private _value: ISelectOption = null;
    public isPopoverOpened$: BehaviorSubject<boolean> = new BehaviorSubject(
        false
    );
    constructor(public popoverController: PopoverController) {}

    public ngOnInit() {}

    async openPopover(openEvent: Event) {
        this.isPopoverOpened$.next(true);
        const popover = await this.popoverController.create({
            event: openEvent,
            component: PopoverComponent,
            cssClass: 'select-popover',
            componentProps: {
                options: this.options,
                selectedOption: this.value,
            },
        });
        await popover.present();
        popover.onDidDismiss().then((dataReturned) => {
            this.isPopoverOpened$.next(false);
            this.onStatusSelect(dataReturned.data ?? this.value);
        });
    }

    public onStatusSelect(event) {
        this.value = event;
        this.onSelectValue.emit(this.value);
    }

    public get value(): ISelectOption {
        return this._value;
    }

    public onChange(_: ISelectOption): void {}

    public writeValue(obj: ISelectOption) {
        this.value = obj;
    }

    public registerOnChange(fn: () => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {}
}
