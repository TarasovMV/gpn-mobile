import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {UserInfoService} from "../../services/user-info.service";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('expandedPanel', [
      state('initial', style({ height: 0 })),
      state('expanded', style({ height: '*' })),
      transition('initial <=> expanded', animate('0.4s')),
    ]),
  ],
})
export class DropdownComponent implements OnInit {
  @Input() data: any[];
  @Input() isStatusDropdown: boolean = false;
  @Output() onChanged = new EventEmitter<number>();
  public currentItemIdx = 0;
  public dropdownExpand: boolean = false;

  constructor(
    private userInfo: UserInfoService
  ) {}

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

  public chooseStatus(i: number): void {
    this.userInfo.statusIndex$.next(i);
  }

  ngOnInit() {}
}
