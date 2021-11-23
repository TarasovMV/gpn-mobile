import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInfoService } from '../../services/user-info.service';
import { IStatusInfo } from '../avatar-modal/avatar-modal.component';
import { expandAnimation } from '../animations/expand.animation';

@Component({
    selector: 'app-status-dropdown',
    templateUrl: './status-dropdown.component.html',
    styleUrls: ['./status-dropdown.component.scss'],
    animations: [expandAnimation],
})
export class StatusDropdownComponent implements OnInit {
    @Input() options: IStatusInfo[];
    @Input() disabled: boolean = false;
    @Input() set currentOptionId(id: number) {
        const statusList = this.userInfo.statusList$.getValue();
        this.currentStatusIdx = this.options.findIndex(item => item.id === id);
        this.currentStatus = statusList.find(item => item.id === id);
    };

    @Output() onChanged = new EventEmitter<number>();

    public currentStatusIdx: number;
    public currentStatus: IStatusInfo = null;
    public dropdownExpand: boolean = false;

    constructor(public userInfo: UserInfoService) {}

    public toggleDropdown(): void {
        this.dropdownExpand = !this.dropdownExpand;
    }

    public closeDropdown(): void {
        this.dropdownExpand = false;
    }

    public chooseStatus(i: number): void {
        this.currentStatusIdx = i;
        this.currentStatus = this.options[i];
        this.onChanged.emit(this.options[i].id);
    }

    ngOnInit() {}
}
