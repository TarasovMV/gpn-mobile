import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-popower',
  templateUrl: './car-popower.component.html',
  styleUrls: ['./car-popower.component.scss'],
})
export class CarPopowerComponent implements OnInit {
    chosenCar: string;

    constructor() { }

    ngOnInit() {}
}
