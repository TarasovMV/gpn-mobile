import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IGpsInfo} from '../../model/gps.model';

@Injectable({
    providedIn: 'root'
})
export class GpsService {
    public readonly position$: BehaviorSubject<IGpsInfo> = new BehaviorSubject<IGpsInfo>(undefined);

    constructor() {}
}
