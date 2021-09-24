import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { ITask } from '../../../../../../@core/model/task.model';

export interface IRemainingTime {
    hours: number | string;
    min: number | string;
}

@Component({
    selector: 'app-tabs-tasks-timer',
    templateUrl: './tabs-tasks-timer.component.html',
    styleUrls: ['./tabs-tasks-timer.component.scss'],
})
export class TabsTasksTimerComponent implements OnDestroy {
    @ViewChild('svg') private svg: ElementRef;
    @Input() set data(task: ITask) {
        const now = new Date();
        this.taskCreatedTime = new Date(
            +new Date(task.dateTimeStart)
        );
        this.taskCreatedTime =
            +now - +this.taskCreatedTime < 0 ? now : this.taskCreatedTime;
        this.taskPlaneTime = new Date(
            +new Date(task.dateTimeEnd)
        );
        /**
         * @description test area
         * this.taskCreatedTime = new Date(new Date().getTime() - 1000 * 60 * 3);
         * this.taskPlaneTime = new Date(new Date().getTime() + 1000 * 60 * 3);
         */
        this.checkType();
        this.calculatePercent();

        this.circleLength = (Math.PI * window.innerHeight * 150) / 1280;
        this.interval = interval(2000).subscribe((item) => {
            this.checkType();
            this.calculatePercent();
        });
    }

    public remainingTime: IRemainingTime = { hours: '00', min: '00' };
    public circleLength: number = 0;
    public safeInterval: number = 30 * 60 * 1000;
    public safeIntervalRemaining: string = '';

    public timerType: 'normal' | 'warning' | 'danger';
    public taskPlaneTime: Date;

    private taskCreatedTime: Date;
    public percent: number = 100;
    private interval: Subscription;

    constructor(private cdRef: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.interval.unsubscribe();
    }

    private calculatePercent(): void {
        if (!this.svg) {
            return;
        }
        //console.log(this.percent);

        const now = new Date();
        const diffNowCreated = +now - +this.taskCreatedTime;
        const diffNowPlan = +now - +this.taskPlaneTime;
        const allInterval = +this.taskPlaneTime - +this.taskCreatedTime;

        switch (this.timerType) {
            case 'normal':
                this.percent = Math.abs(diffNowCreated / allInterval);
                const remainingTime = {
                    hours:
                        '' + Math.floor(Math.abs(diffNowPlan) / 1000 / 60 / 60),
                    min:
                        '' +
                        Math.floor((Math.abs(diffNowPlan) / 1000 / 60) % 60),
                };
                console.log(
                    'now cratesd ' + +now + '  ' + +this.taskCreatedTime
                );

                console.log(this.percent);

                this.remainingTime = {
                    hours:
                        remainingTime.hours.length === 2
                            ? remainingTime.hours
                            : '0' + remainingTime.hours,
                    min:
                        remainingTime.min.length === 2
                            ? remainingTime.min
                            : '0' + remainingTime.min,
                };
                break;
            case 'warning':
                this.percent = Math.abs(diffNowPlan / +this.safeInterval);
                this.safeIntervalRemaining =
                    '' + (30 - Math.ceil(diffNowPlan / 1000 / 60));
                break;
            case 'danger':
                this.interval.unsubscribe();
        }
        this.checkType();
    }

    private checkType(): void {
        const now = new Date();

        const dataDiff = +now - +this.taskPlaneTime;
        const allInterval = +this.taskPlaneTime - +this.taskCreatedTime;
        if (allInterval === 0) {
            this.timerType =
                dataDiff > this.safeInterval ? 'danger' : 'warning';
        } else {
            this.timerType =
                dataDiff > this.safeInterval
                    ? 'danger'
                    : dataDiff > 0
                    ? 'warning'
                    : 'normal';
        }
    }
}
