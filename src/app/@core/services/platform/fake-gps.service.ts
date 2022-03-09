import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {ICoordinate, IGpsService} from '../../model/gps.model';
import {GeoProjectionService} from '../../../services/graphs/geo-projection.service';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {concatMap, delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FakeGpsService implements IGpsService{
    public readonly position$: BehaviorSubject<ICoordinate> = new BehaviorSubject<ICoordinate>(undefined);
    private route = [];
    private routeSubscription: Subscription;

    constructor(
        private geoProjection: GeoProjectionService
    ) {}

    public init(route: ICoordinate[]): void {
        this.route = route
            .map(point => this.geoProjection.wgsConvert({latitude: point.y, longitude: point.x}))
            .map(point => ({x: point.x, y: point.y})) ?? [];
        this.startRoute(this.divideRoute(this.route));
    }

    public cancel(): void {
        this.stopRoute();
        this.position$.next(undefined);
    }

    private divideRoute(initRoute: ICoordinate[]): ICoordinate[] {
        const circle = (route: ICoordinate[]): ICoordinate[] => {
            const pair = [];
            route.forEach((item, i, arr) => {
                if (arr.length - 1 === i) { return; }
                pair.push([item, arr[i + 1]]);
            });
            const newRoute = [];
            pair.forEach(item => {
                newRoute.push(item[0], {x: (item[0].x + item[1].x) / 2, y: (item[0].y + item[1].y) / 2});
            });
            return newRoute;
        };
        const iteration = 7;
        let changeRoute = initRoute;
        for (let i = 0; i < iteration; i++) {
            changeRoute = circle(changeRoute);
        }
        return changeRoute;
    }

    private startRoute(route: ICoordinate[]): void {
        this.routeSubscription = fromArray(route)
            .pipe(delay(1000), concatMap(item => of(item).pipe(delay(10))))
            .subscribe(x => this.position$.next(x));
    }

    private stopRoute(): void {
        this.routeSubscription?.unsubscribe();
    }
}
