import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
export class TabsTasksTimerComponent implements OnInit, AfterViewInit {
    @ViewChild('svg') private svg: ElementRef;
    @Input() set data(task: ITask) {
        this.taskCreatedTime = new Date(task.dateTimeStart);
        this.taskPlaneTime = new Date(task.dateTimeEnd);
    }

    public remainingTime: IRemainingTime = null;
    public circleLength: number = 0;
    public safeInterval: number = 30 * 60 * 1000;
    public safeIntervalRemaining: string = '';

    public timerType: 'normal' | 'warning' | 'danger';
    public taskPlaneTime: Date;

    private taskCreatedTime: Date;
    private percent$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.checkType();
        this.calculatePercent();

        setInterval(() => {
            this.checkType();
            this.calculatePercent();
        }, 500);
    }

    public get percent(): number {
        return this.percent$.getValue();
    }

    public set percent(value: number) {
        this.percent$.next(value);
    }

    private calculatePercent(): void {
        if (!this.svg) {
            return;
        }
        this.circleLength = Math.PI * this.svg?.nativeElement.clientHeight ?? 0;
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
        }
        this.checkType();
    }

    private checkType(): void {
        const now = new Date();

        const dataDiff = +now - +this.taskPlaneTime;

        this.timerType =
            dataDiff > this.safeInterval
                ? 'danger'
                : dataDiff >= 0
                ? 'warning'
                : 'normal';
    }
}
