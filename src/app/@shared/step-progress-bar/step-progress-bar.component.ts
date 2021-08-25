import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-step-progress-bar',
  templateUrl: './step-progress-bar.component.html',
  styleUrls: ['./step-progress-bar.component.scss'],
})
export class StepProgressBarComponent implements OnInit {

    @Input() public stepsCount: number;
    @Input() public activeStepIndex: number;
    public numbers: number[];

    constructor() {}

    ngOnInit() {
      this.numbers = [];
      for (let n = 0; n < this.stepsCount; n++) {
          this.numbers.push(n);
      }
    }
}
