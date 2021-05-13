import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-progress',
  templateUrl: './map-progress.component.html',
  styleUrls: ['./map-progress.component.scss'],
})
export class MapProgressComponent implements OnInit {
    @Input() percent: number = 0;
    @Input() name: string;
    constructor() { }

    ngOnInit() {}

}
