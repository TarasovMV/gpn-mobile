import {Inject, Injectable} from '@angular/core';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';
import {GPS} from '../tokens';
import {IGpsService} from '../model/gps.model';
import {GeoProjectionService} from '../../services/graphs/geo-projection.service';
import {GpsProjectionService} from '../../services/graphs/gps-projection.service';
import {EmergencyCancellationService} from '../../services/emergency-cancellation.service';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CarTrackingService {
    private isEnd = false;

    private get destination(): { taskId: number; pointId: number | string; x: number; y: number } {
        if (!this.tabsService.currentTask$.getValue()) {
            return undefined;
        }
        const id = this.tabsService.currentTask$.getValue().id;
        const node = this.tabsService.currentTask$.getValue().node;
        return {taskId: id, pointId: node.id, x: node.point.x, y: node.point.y};
    }

    constructor(
        @Inject(GPS) private gpsService: IGpsService,
        private geoProjection: GeoProjectionService,
        private gpsProjection: GpsProjectionService,
        private tabsService: TabsInfoService,
        private emergencyCancellation: EmergencyCancellationService,
    ) {
        this.listen();
    }

    private listen(): void {
        this.gpsService.position$.pipe(filter(x => !!x)).subscribe(pos => {
            const destination = this.destination;
            const res = this.gpsProjection.getProjection(pos);

            if (!!destination) {
                if (this.isEnd && this.geoProjection.isOut(res, destination)) {
                    this.emergencyCancellation.openEmergencyCancellationModal().then();
                }
                this.isEnd = this.geoProjection.isEnd(res, destination);
            }
        });
    }
}
