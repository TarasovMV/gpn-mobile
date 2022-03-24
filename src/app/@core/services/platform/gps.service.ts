import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject, interval, Observable, Subject} from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import {IGpsInfo, IGpsService} from '../../model/gps.model';
import {Position} from '@capacitor/geolocation/dist/esm/definitions';
import {filter, map, tap, throttleTime} from 'rxjs/operators';
import {GeoProjectionService} from '../../../services/graphs/geo-projection.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {TabsInfoService} from '../../../services/tabs/tabs-info.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {positionStringify} from '../../functions/position-stringify.function';
import {EmergencyCancellationService} from '../../../services/emergency-cancellation.service';
import {CarTrackingService} from '../car-tracking.service';


@Injectable()
export class GpsService implements IGpsService {
    public readonly position$: BehaviorSubject<IGpsInfo> = new BehaviorSubject<IGpsInfo>(undefined);
    public readonly rawPosition$: Subject<Position> = new Subject<Position>();
    public readonly sendPosition$: Subject<Position> = new Subject<Position>();

    private readonly restUrl: string = environment.restUrl;

    constructor(
        private geoProjection: GeoProjectionService,
        private http: HttpClient,
        private injector: Injector,
    ) {
        this.init().then();
    }

    public async init(): Promise<void> {
        const permission = await Geolocation.checkPermissions();
        await Geolocation.watchPosition({enableHighAccuracy: true, timeout: 50}, (x: Position) => this.rawPosition$.next(x));
        this.rawPosition$.pipe(
            filter((x) => !!x?.coords?.longitude && !!x?.coords?.latitude),
            tap((x) => this.sendPosition$.next(x)),
            map((x) => this.geoProjection.wgsConvert({latitude: x.coords.latitude, longitude: x.coords.longitude})),
        ).subscribe(x => this.position$.next(x));
        this.sendPosition$.pipe(throttleTime(3000)).subscribe(x => this.sendPosition(x));
    }

    public get getCurrentPosition(): Observable<Position> {
        return fromPromise(Geolocation.getCurrentPosition());
    }

    private sendPosition(position: Position): void {
        const tabsService = this.injector.get<TabsInfoService>(TabsInfoService);
        const trackingService = this.injector.get<CarTrackingService>(CarTrackingService);
        if (!tabsService.currentTask$.getValue()) {
            return;
        }
        const taskId = tabsService.currentTask$.getValue().id ?? null;
        const body = {
            taskId,
            userId: 7,
            currentPosition: positionStringify(position.coords),
            taskAllTime: Math.round(trackingService.taskAllTime),
            taskRestTime: Math.round(trackingService.taskRestTime),
        };
        this.http.post(`${this.restUrl}/api/WorkShift/current-position`, body).toPromise().then();
    }
}
