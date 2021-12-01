import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IGraph } from './graphs.models';
import * as jsnx from 'jsnx';
import {map, take} from 'rxjs/operators';
import { ICoord } from '../../pages/tabs/pages/tabs-tasks/tabs-tasks.page';
import { GeoProjection } from 'as-geo-projection';

@Injectable({
    providedIn: 'root',
})
export class ShortestPathService {
    private geo;
    private graph: IGraph = null;
    constructor(private http: HttpClient) {
        this.geo = new GeoProjection();
        this.getGraph().pipe(take(1)).subscribe(data => {
            this.graph = data;
        });
    }

    public getGraph(): Observable<IGraph> {
        return this.http.get<IGraph>(`assets/graphs/graph1.json`);
    }

    public findShortest(source: number | string, target: number | string): ICoord[] {
        const G = new jsnx.Graph();

        this.graph.nodes.forEach((node) => {
            G.addNode(node.id);
        });

        this.graph.links.forEach((link) => {
            G.addEdge(link.source, link.target);
            G.getEdgeData(link.source, link.target).weight =
                link.weight;
        });

        const path: any[] = jsnx.shortestPath(G, {
            source,
            target,
            weight: 'weight',
        });

        this.graph.nodes.forEach((node) => {
            const myNode = path.findIndex(
                (nodeId) => nodeId === node.id
            );
            if (myNode !== -1) {
                path[myNode] = node.Coords;
            }
        });

        const transformedPath = this.geoTransform(path);

        return transformedPath;
    }

    public geoTransform(coords: any[]): ICoord[] {
        coords = coords.map(item => ({x: item.Y, y: item.X}));
        return coords.map((item) => {
            const flat = this.geo.getRelativeByWgs({ latitude: item.y, longitude: item.x });
            return { x: flat.x, y: 100 - flat.y };
        });
    }
}
