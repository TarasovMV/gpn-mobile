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
    @Input() data: ITask;
    @Input() isActive: boolean;

    public percent$: BehaviorSubject<number> = new BehaviorSubject<number>(20);
    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {}
}
