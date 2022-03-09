import {Component, Inject} from '@angular/core';
import {IGpsService} from '../../../../@core/model/gps.model';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {GpsProjectionService} from '../../../../services/graphs/gps-projection.service';
import {GeoProjectionService} from '../../../../services/graphs/geo-projection.service';

@Component({
    selector: 'app-map-debug',
    templateUrl: './map-debug.component.html',
    styleUrls: ['./map-debug.component.scss'],
})
export class MapDebugComponent {
    public readonly longitude$: Observable<number> = this.gpsService.rawPosition$.pipe(map(x => x?.coords?.longitude));
    public readonly latitude$: Observable<number> = this.gpsService.rawPosition$.pipe(map(x => x?.coords?.latitude));
    public readonly accuracy$: Observable<number> = this.gpsService.rawPosition$.pipe(map(x => x?.coords?.accuracy));
    public readonly valid$: Observable<boolean> = this.gpsService.position$.pipe(
        filter(x => !!x),
        map(x => {
            const res = this.gpsProjection.getProjection(x);
            // const res = x;
            const user = this.geoProjection.relativeConvert({x: res.x, y: res.y});
            return !(user.x > 100 || user.x < 0 || user.y > 100 || user.y < 0);
        })
    );

    constructor(
        @Inject('GPS') private gpsService: IGpsService,
        private gpsProjection: GpsProjectionService,
        private geoProjection: GeoProjectionService,
    ) {}
}
