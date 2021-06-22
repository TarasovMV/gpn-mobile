import {Component, Input, OnInit} from '@angular/core';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

@Component({
  selector: 'app-map-progress',
  templateUrl: './map-progress.component.html',
  styleUrls: ['./map-progress.component.scss'],
})
export class MapProgressComponent implements OnInit {
    @Input() percent = 0;
    @Input() name: string;
    constructor(
        public tabsService: TabsInfoService
    ) { }

    ngOnInit() {}

}
