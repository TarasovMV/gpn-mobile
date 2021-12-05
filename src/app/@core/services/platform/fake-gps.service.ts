import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ICoordinate} from '../../model/gps.model';

@Injectable({
    providedIn: 'root'
})
export class FakeGpsService {
    public readonly position$: BehaviorSubject<ICoordinate> = new BehaviorSubject<ICoordinate>(undefined);
    private points: ICoordinate[];
    private taskId: number;
    private readonly delay = 1000 * 1;

    constructor() {
        setInterval(() => {
            this.position$.next(this.points.splice(this.points.length - 1, 1)[0]);
        }, this.delay);
    }

    public addPoints(taskId: number, points: ICoordinate[]): void {
        if (!!taskId && taskId === this.taskId) {
            return;
        }
        this.points = [...this.points, ...points];
    }
}
