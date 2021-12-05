import {Injectable} from '@angular/core';
import {ICoordinate} from '../../@core/model/gps.model';


interface IGpsProjection extends ICoordinate {
    linkId: string | number;
}

@Injectable({
    providedIn: 'root'
})
export class GpsProjectionService {

    constructor() {}

    public getProjection(coords: ICoordinate): IGpsProjection {
        return {} as IGpsProjection;
    }
}
