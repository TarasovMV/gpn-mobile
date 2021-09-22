import { Component, Input, OnInit } from '@angular/core';
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
export class TabsTasksTimerComponent implements OnInit {
    @Input() set data(task: ITask) {
        this.taskCreatedTime = new Date(task.dateTimeStart);
        this.taskPlaneTime = new Date(task.dateTimeEnd);

        this.checkType();
        this.calculatePercent();
    }

    public remainingTime: IRemainingTime = null;
    public circleLength: number = Math.PI * 148;
    public safeInterval: number = 30 * 60 * 1000;
    public safeIntervalRemaining: string = '';

    public timerType: 'normal' | 'warning' | 'danger';
    public taskPlaneTime: Date;

    private taskCreatedTime: Date;
    private percent$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor() {}

    ngOnInit() {
        setInterval(() => {
            this.checkType();
            this.calculatePercent();
        }, 20000);
    }

    public get percent(): number {
        return this.percent$.getValue();
    }

    public set percent(value: number) {
        this.percent$.next(value);
    }

    private calculatePercent(): void {
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
                    '' + Math.ceil(diffNowPlan / 1000 / 60);
                break;
        }
        this.checkType();
    }

    private checkType(): void {
        const now = new Date();
        console.log(+now);
        console.log(+this.taskPlaneTime);

        const dataDiff = +now - +this.taskPlaneTime;

        this.timerType =
            dataDiff > this.safeInterval
                ? 'danger'
                : dataDiff >= 0
                ? 'warning'
                : 'normal';
    }
}
