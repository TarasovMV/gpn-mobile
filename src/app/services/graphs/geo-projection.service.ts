import {Injectable} from '@angular/core';
import {GeoProjection, toFlat} from 'as-geo-projection';
import {ICoordinate} from '../../@core/model/gps.model';
import {IGeoProjectionWGS} from 'as-geo-projection/build/main/lib/geo-projection';


@Injectable({
    providedIn: 'root'
})
export class GeoProjectionService {
    private readonly topLeftCoords: ICoordinate;
    private readonly bottomRightCoords: ICoordinate;
    private readonly geo: GeoProjection = new GeoProjection();

    constructor() {}

    public wgsConvert(coords: IGeoProjectionWGS): ICoordinate {
        return toFlat(coords);
    }

    public relativeConvert(coords: ICoordinate): ICoordinate {
        const res = this.geo.getRelativeByFlat(coords);
        return {x: res.x, y: 100 - res.y};
    }

    // TODO: add logic
    public isEnd(user: ICoordinate, destination: ICoordinate) {
        return false;
    }
}
