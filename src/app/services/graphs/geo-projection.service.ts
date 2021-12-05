import {Injectable} from '@angular/core';
import { toFlat } from 'as-geo-projection';
import {ICoordinate} from '../../@core/model/gps.model';
import {IGeoProjectionWGS} from 'as-geo-projection/build/main/lib/geo-projection';


@Injectable({
    providedIn: 'root'
})
export class GeoProjectionService {
    private readonly topLeftCoords: ICoordinate;
    private readonly bottomRightCoords: ICoordinate;

    constructor() {}

    public wgsConvert(coords: IGeoProjectionWGS): ICoordinate {
        return toFlat(coords);
    }

    public relativeConvert(coords: ICoordinate): ICoordinate {
        const dx: number = this.bottomRightCoords.x - this.topLeftCoords.x;
        const dy: number = this.topLeftCoords.y - this.bottomRightCoords.y;
        return {
            x: (coords.x - this.topLeftCoords.x) / dx * 100,
            y: (coords.y - this.bottomRightCoords.y) / dy * 100,
        };
    }

    // TODO: add logic
    public isEnd(user: ICoordinate, destination: ICoordinate) {
        return false;
    }
}
