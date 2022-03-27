import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInfoService } from '../../@core/services/user-info.service';
import {expandAnimation} from '../animations/expand.animation';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    animations: [expandAnimation],
})
export class DropdownComponent implements OnInit {
    @Input() data: string[];
    @Output() onChanged = new EventEmitter<number>();
    public currentItemIdx = 0;
    public dropdownExpand: boolean = false;

    constructor(public userInfo: UserInfoService) {}

    public toggleDropdown(): void {
        this.dropdownExpand = !this.dropdownExpand;
    }

    public closeDropdown(): void {
        this.dropdownExpand = false;
    }

    public chooseItem(idx: number): void {
        this.currentItemIdx = idx;
        this.onChanged.emit(this.currentItemIdx);
    }

    ngOnInit() {}
}
