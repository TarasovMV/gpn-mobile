import {Inject, Injectable} from '@angular/core';
import {TabsInfoService} from './tabs-info.service';
import {GPS} from '../tokens';
import {IGpsInfo, IGpsService} from '../model/gps.model';
import {combineLatest} from 'rxjs';
import {ITask} from '../model/task.model';
import {GpsProjectionService} from './graphs/gps-projection.service';
import {ShortestPathService} from './graphs/shortest-path.service';
import {GeoProjectionService} from './graphs/geo-projection.service';

const DISTANCE_EPS = 200; // погрешность сравнения расстояния в метрах

@Injectable({
    providedIn: 'root'
})
export class CurrentTaskTrackingService {

    constructor(
        @Inject(GPS) private readonly gpsService: IGpsService,
        private readonly gpsProjection: GpsProjectionService,
        private readonly geoProjection: GeoProjectionService,
        private readonly pathService: ShortestPathService,
        private readonly tabsService: TabsInfoService,
    ) {
        this.listen();
    }

    private listen(): void {
        combineLatest([
            this.gpsService.position$,
            this.tabsService.newItems$,
        ]).subscribe(([position, tasks]) => {
            this.tabsService.currentTask$.next(this.taskHandler(position, tasks));
        });
    }

    private taskHandler(position: IGpsInfo, tasks: ITask[]): ITask {
        if (!!tasks.length) {
            tasks = tasks.sort((a, b) => a.order - b.order);
            // Проверка на экстразадачи
            if (tasks[0].order === 1 || tasks[0].order === 2 || !position) {
                return tasks[0];
            }

            const currentTask = this.tabsService.currentTask$.getValue();
            const calcPosition = this.gpsProjection.getProjection(position);

            const distTasks = tasks.map(x => {
                const path = this.pathService.findShortest(calcPosition.linkId, x.node.id, {x: calcPosition.x, y: calcPosition.y});
                const distance = this.geoProjection.getPathDistance(path);

                return {
                    id: x.id,
                    distance
                };
            }).sort((a, b) => a.distance - b.distance);

            const currentDist = distTasks.find(x => x.id === currentTask.id)?.distance ?? Infinity;
            if (currentDist - DISTANCE_EPS > distTasks[0].distance) {
                return tasks.find(x => x.id === distTasks[0].id);
            }
            return currentTask;
        }

        if (!!this.tabsService.selectedItems$.getValue()?.length) {
            return this.tabsService.elkTask;
        }

        return null;
    }
}
