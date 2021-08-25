import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  public dropdownList: string[] = ['Другое', '1', '2'];
  public currentValueIdx: number = 0;

  constructor() {}

  public changeDropdownValue(idx: number): void {
    this.currentValueIdx = idx;
  }

  ngOnInit() {}
}
