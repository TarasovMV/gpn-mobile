import {Inject, Injectable} from '@angular/core';
import {TabsInfoService} from '../../services/tabs/tabs-info.service';
import {GPS} from '../tokens';
import {IGpsInfo, IGpsService} from '../model/gps.model';
import {combineLatest} from 'rxjs';
import {ITask} from '../model/task.model';


@Injectable({
    providedIn: 'root'
})
export class CurrentTaskTrackingService {

    constructor(
        @Inject(GPS) private readonly gpsService: IGpsService,
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
            return tasks[0];
            // TODO: check extra
            // TODO: check distance
        } else {
            if (!!this.tabsService.selectedItems$.getValue()?.length) {
                return this.tabsService.elkTask;
            } else {
                return null;
            }
        }
    }
}
