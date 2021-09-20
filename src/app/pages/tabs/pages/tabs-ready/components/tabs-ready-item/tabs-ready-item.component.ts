import { Component, Input, OnInit } from '@angular/core';
import { ITask } from '../../../../../../@core/model/task.model';

@Component({
    selector: 'app-tabs-ready-item',
    templateUrl: './tabs-ready-item.component.html',
    styleUrls: ['./tabs-ready-item.component.scss'],
})
export class TabsReadyItemComponent implements OnInit {
    @Input() data: ITask;
    @Input() type: 'taken' | 'ended';
    constructor() {}

    ngOnInit() {}
}
