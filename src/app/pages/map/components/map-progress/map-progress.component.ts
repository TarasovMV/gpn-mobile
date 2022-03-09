import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TabsInfoService} from '../../../../services/tabs/tabs-info.service';

@Component({
    selector: 'app-map-progress',
    templateUrl: './map-progress.component.html',
    styleUrls: ['./map-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapProgressComponent implements OnInit {
    @Input() name: string;
    @Input() percent = 0;
    @Input() time: number;

    constructor(public tabsService: TabsInfoService) {}

    ngOnInit(): void {}
}
