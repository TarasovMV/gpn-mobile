import {Injectable} from '@angular/core';
import {ICoordinate} from '../../@core/model/gps.model';
import {IGraph} from '../../@core/model/graphs.models';
import {GRAPH} from './graph.const';


interface IGpsProjection extends ICoordinate {
    linkId: number;
}

@Injectable({
    providedIn: 'root'
})
export class GpsProjectionService {

    constructor() {}

    public getProjection(dot: ICoordinate, graph: IGraph = GRAPH): IGpsProjection {
        const getCoerced = (link, point) => {
            link.coords = link.coords.sort((cur, next) => cur.x - next.x);

            const x1 = link.coords[0].x;
            const x2 = link.coords[1].x;
            const y1 = link.coords[0].y;
            const y2 = link.coords[1].y;

            const a = 1 / (x2 - x1);
            const b = 1 / (y1 - y2);
            const c = (y1 / (y2 - y1) - x1 / (x2 - x1));
            const d = b * point.x - a * point.y;

            const y = -(c + a / b * d) / (a * a / b + b);
            const x = (a * y + d) / b;

            if (x > link.coords[1].x || x < link.coords[0].x) {
                return { x, y, dist: Number.POSITIVE_INFINITY, linkId: link.id };
            } else {
                return { x, y, dist:  Math.sqrt((x - point.x) * (x - point.x) + (y - point.y) * (y - point.y)), linkId: link.id };
            }
        };

        const filterCuts = (point, routes) => {
            const centerDist = (p1, p2) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
            return [...routes].sort((cur, next) => centerDist(point, cur.center) - centerDist(point, next.center)).slice(0, 10);
        };

        const nearLinks = filterCuts(dot, graph.links);
        return nearLinks.map(x => getCoerced(x, dot)).sort((cur, next) => cur.dist - next.dist)[0];
    }
}
