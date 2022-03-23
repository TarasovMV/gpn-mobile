import {Inject, Injectable} from '@angular/core';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';
import {GPS} from '../tokens';
import {IGpsInfo, IGpsService} from '../model/gps.model';
import {GeoProjectionService} from '../../services/graphs/geo-projection.service';
import {GpsProjectionService} from '../../services/graphs/gps-projection.service';
import {EmergencyCancellationService} from '../../services/emergency-cancellation.service';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {ShortestPathService} from '../../services/graphs/shortest-path.service';

@Injectable({
    providedIn: 'root'
})
export class CarTrackingService {
    taskAllTime: number = null;
    taskRestTime: number = null;

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
        private pathService: ShortestPathService,
        private tabsService: TabsInfoService,
        private emergencyCancellation: EmergencyCancellationService,
    ) {
        this.listen();
    }

    private listen(): void {
        const task$ = this.tabsService.currentTask$.pipe(
            distinctUntilChanged((cur, next) => cur?.id === next?.id),
            tap(() => {
                this.taskAllTime = null;
                this.taskRestTime = null;
            })
        );
        const position$ = this.gpsService.position$.pipe(filter(x => !!x));

        combineLatest([position$, task$]).pipe(
            filter(([pos, task]) => !!pos && !!task && !!this.destination),
            map(([pos]) => [pos, this.destination] as const)
        ).subscribe(([pos, destination]) => {
            const res = this.gpsProjection.getProjection(pos);
            const path = this.pathService.findShortest(res.linkId, destination.pointId, {x: res.x, y: res.y});
            const time = this.geoProjection.getPathTime(path);
            this.taskAllTime = this.taskAllTime ?? time;
            this.taskRestTime = time;
        });

        position$.subscribe(pos => {
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
