import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Position} from '@capacitor/geolocation/dist/esm/definitions';

export interface ICoordinate {
    x: number;
    y: number;
}

// TODO: add fields
export interface IGpsInfo extends ICoordinate {
    prop?: any;
}

export interface IGpsService {
    readonly position$: BehaviorSubject<IGpsInfo>;
    getCurrentPosition: Observable<Position>;
    readonly rawPosition$?: Subject<Position>;
    init?: (route?: ICoordinate[]) => void;
    cancel?: () => void;
}
