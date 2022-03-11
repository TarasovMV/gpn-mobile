import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Subject} from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import {IGpsInfo, IGpsService} from '../../model/gps.model';
import {Position} from '@capacitor/geolocation/dist/esm/definitions';
import {filter, map, tap, throttleTime} from 'rxjs/operators';
import {GeoProjectionService} from '../../../services/graphs/geo-projection.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {TabsInfoService} from '../../../services/tabs/tabs-info.service';

@Injectable({
    providedIn: 'root'
})
export class GpsService implements IGpsService {
    public readonly position$: BehaviorSubject<IGpsInfo> = new BehaviorSubject<IGpsInfo>(undefined);
    public readonly rawPosition$: Subject<Position> = new Subject<Position>();
    public readonly sendPosition$: Subject<Position> = new Subject<Position>();

    private readonly restUrl: string = environment.restUrl;

    constructor(
        private geoProjection: GeoProjectionService,
        private http: HttpClient,
        private tabsService: TabsInfoService,
    ) {
        // interval(2000).pipe(
        //     throttleTime(1000),
        //     tap((x) => console.log('interval', x))
        // ).subscribe();
    }

    public async init(): Promise<void> {
        const permission = await Geolocation.checkPermissions();
        await Geolocation.watchPosition({enableHighAccuracy: true, timeout: 500}, (x: Position) => this.rawPosition$.next(x));
        this.rawPosition$.pipe(
            filter((x) => !!x?.coords?.longitude && !!x?.coords?.latitude),
            tap((x) => this.sendPosition$.next(x)),
            map((x) => this.geoProjection.wgsConvert({latitude: x.coords.latitude, longitude: x.coords.longitude})),
        ).subscribe(x => this.position$.next(x));
        this.sendPosition$.pipe(throttleTime(5000)).subscribe(x => this.sendPosition(x));
    }

    private sendPosition(position: Position): void {
        const taskId = this.tabsService.currentTask$?.getValue()?.id ?? null;
        const body = {
            taskId,
            userId: 7,
            currentPosition: `${position.coords.latitude}, ${position.coords.longitude}`,
        };
        this.http.post(`${this.restUrl}/api/WorkShift/current-position`, body).toPromise().then();
    }
}
