import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IGraph } from './graphs.models';
import * as jsnx from 'jsnx';
import { map } from 'rxjs/operators';
import { ICoord } from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';
import { GeoProjection } from 'as-geo-projection';

@Injectable({
    providedIn: 'root',
})
export class ShortestPathService {
    private geo;
    constructor(private http: HttpClient) {
        this.geo = new GeoProjection();
    }

    public getGraph(): Observable<IGraph> {
        return this.http.get<IGraph>(`assets/graphs/graph1.json`);
    }

    public findShortest(source: number, target: number): Observable<ICoord[]> {
        const G = new jsnx.Graph();
        return this.getGraph().pipe(
            map((item) => {
                item.nodes.forEach((node) => {
                    G.addNode(node.id);
                });

                item.links.forEach((link) => {
                    G.addEdge(link.source, link.target);
                    G.getEdgeData(link.source, link.target).weight =
                        link.weight;
                });

                const path: any[] = jsnx.shortestPath(G, {
                    source,
                    target,
                    weight: 'weight',
                });

                item.nodes.forEach((node) => {
                    const myNode = path.findIndex(
                        (nodeId) => nodeId === node.id
                    );
                    if (myNode !== -1) {
                        path[myNode] = node.Coords;
                    }
                });

                return this.geoTransform(path);
            })
        );
    }

    public geoTransform(coords: any[]): ICoord[] {
        coords = coords.map(item => ({x: item.Y, y: item.X}));
        return coords.map((item) => {
            const flat = this.geo.getRelativeByWgs({ latitude: item.y, longitude: item.x });
            return { x: flat.x, y: 100 - flat.y };
        });
    }
}
