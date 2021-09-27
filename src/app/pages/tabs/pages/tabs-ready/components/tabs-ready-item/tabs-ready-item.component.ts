import { Component, Input, OnInit } from '@angular/core';
import { ITask } from '../../../../../../@core/model/task.model';

@Component({
    selector: 'app-tabs-ready-item',
    templateUrl: './tabs-ready-item.component.html',
    styleUrls: ['./tabs-ready-item.component.scss'],
})
export class TabsReadyItemComponent implements OnInit {
    public probesCount: number = 0;
    @Input() type: 'taken' | 'ended';
    @Input() public set data(value: ITask) {
        this._data = value;
        this.probesCount = value.probes.map(x => x.count).reduce((acc, next) => acc + next, 0);
    }
    public get data(): ITask {
        return this._data;
    }
    private _data: ITask;
    constructor() {}

    ngOnInit() {}
}
