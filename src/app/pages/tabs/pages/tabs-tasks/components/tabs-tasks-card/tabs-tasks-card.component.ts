import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../../../../../../@core/model/task.model';

@Component({
    selector: 'app-tabs-tasks-card',
    templateUrl: './tabs-tasks-card.component.html',
    styleUrls: ['./tabs-tasks-card.component.scss'],
})
export class TabsTasksCardComponent implements OnInit, AfterViewInit {
    public taresCount: number = 0;
    public probesCount: number = 0;
    public percent$: BehaviorSubject<number> = new BehaviorSubject<number>(20);
    @Input() isActive: boolean;
    @Input() public set data(value: ITask) {
        this._data = value;
        this.taresCount = value.tares.map(x => x.count).reduce((acc, next) => acc + next, 0);
        this.probesCount = value.probes.map(x => x.count).reduce((acc, next) => acc + next, 0);
    }
    public get data(): ITask {return this._data;}
    private _data: ITask;

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {}
}
