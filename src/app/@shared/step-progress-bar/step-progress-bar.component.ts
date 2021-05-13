import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'app-step-progress-bar',
    templateUrl: './step-progress-bar.component.html',
    styleUrls: ['./step-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepProgressBarComponent {
    @Input()
    public activeStepIndex: number;
    public _numbers: number[];

    @Input()
    set stepsCount(count: number) {
        this._numbers = [];
        for (let n = 0; n < count; n++) {
            this._numbers.push(n);
        }
    };
}
