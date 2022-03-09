import {Injectable} from '@angular/core';
import {GeoProjection, toFlat, toWGS} from 'as-geo-projection';
import {ICoordinate} from '../../@core/model/gps.model';
import {IGeoProjectionWGS} from 'as-geo-projection/build/main/lib/geo-projection';


@Injectable({
    providedIn: 'root'
})
export class GeoProjectionService {
    private readonly geo: GeoProjection;

    constructor() {
        this.geo = new GeoProjection();
    }

    public wgsConvert(coords: IGeoProjectionWGS): ICoordinate {
        return toFlat(coords);
    }

    public epsgConvert(coords: ICoordinate): IGeoProjectionWGS{
        return toWGS(coords);
    }

    public relativeConvert(coords: ICoordinate): ICoordinate {
        const res = this.geo.getRelativeByFlat(coords);
        return {x: res.x, y: 100 - res.y};
    }

    public isEnd(user: ICoordinate, destination: ICoordinate): boolean {
        const delta = Math.sqrt((user.x - destination.x) * (user.x - destination.x) + (user.y - destination.y) * (user.y - destination.y));
        return delta < 110;
    }

    /**
     * @description return path time in ms for speed = 25km/h as default
     * @param path - user path
     * @param speed - user speed in km/h
     */
    public getPathTime(path: ICoordinate[], speed: number = 25): number {
        return path.reduce((acc, next, i, arr) =>
            arr.length - 1 === i
                ? acc
                : acc + this.getDistanceMeters(this.epsgConvert(next), this.epsgConvert(arr[i + 1])),
            0
        ) / (speed / 3.6) * 1000;
    }

    public getDistanceMeters(point1: IGeoProjectionWGS, point2: IGeoProjectionWGS): number {
        const lon1 = point1.longitude * Math.PI / 180;
        const lon2 = point2.longitude * Math.PI / 180;
        const lat1 = point1.latitude * Math.PI / 180;
        const lat2 = point2.latitude * Math.PI / 180;

        // Haversine formula
        const dlon = lon2 - lon1;
        const dlat = lat2 - lat1;
        const a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2),2);

        const c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in meters.
        const r = 6371 * 1000;

        // calculate the result
        return c * r;
    }
}
